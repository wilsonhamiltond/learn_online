
import { UserSchema } from '../../schemas/security/user.schema';
import * as crypto from 'crypto';
import { BaseModel } from '../base.model';
import { RoleSchema } from '../../schemas/security/role.schema';
import { USER_STATUS_ENUM, USER_TYPE_ENUM } from '../../../src/services/security/user.service';
import { mongo } from 'mongoose';
import { PersonSchema } from '../../schemas/security/person.schema';
import { SettingSchema } from '../../schemas/security/setting.schema';
import { readFileSync } from 'fs';
import { MailModel } from './mail.model';
import { join } from 'path';
import { IPerson } from '../../../src/models/security/person.model';
import * as config from 'config'
import { ROLES_SISTEM_ENUM } from '../../../src/services/security/role.service';

export class UserModel extends BaseModel{
    private algorithm:string = 'aes-256-ctr';
    private password:string = 'a@193746';
    
    constructor( ){
        super(UserSchema, 'user');
    }
    
    async save( _user:any){
        try{
            let personModel = new BaseModel(PersonSchema, 'person'),
                settingModel = new BaseModel(SettingSchema, 'setting'),
                setting = await settingModel.get(_user.setting),
                user_quantity: number = await this.size( {user_name: _user.user_name})
            if(user_quantity > 0){
                if(_user.type == USER_TYPE_ENUM.local)
                    throw new Error(`El usuario ${_user.user_name} ya existe en el sistema.`)
                else{
                    let logged_user = await this.login(_user);
                    logged_user.login = true;
                    return logged_user;
                }
            }

            if(setting.max_user){
                let user_length = await this.size({'setting._id': setting._id})
                if(user_length >= setting.max_user )
                    throw new Error( `Con el plan actual solo puede crear ${ setting.max_user } usuarios.`)
            }

            _user.person.setting = _user.setting;
            _user.person.create_user = _user.create_user;
            _user.person.create_date = _user.create_date;
            let person = await personModel.save(_user.person);
            _user.password = this.encrypt(_user.password)
            _user.person = person._id;
            _user.roles = [ new mongo.ObjectId(ROLES_SISTEM_ENUM.student)];
            let user = await super.save(_user);
            if(user.status.toString() == USER_STATUS_ENUM.actived){
                await this.welcome_mail(person);
                _user.password = this.decrypt(_user.password)
                return await this.login(_user);
            }else
                await this.register_mail(person.email, user._id.toString());
            return user
        }catch(error){
            console.log(error)
            return `Error registrando el usuario ${_user.user_name}.`
        }
    }
    
    async register( _user:any){
        let settingModel = new BaseModel(SettingSchema, 'setting'),
            settings = await settingModel.filter({}, { _id: 1, max_user: 1}, null, 0, 1);
        _user.setting = settings[0]._id;
        _user.create_date = new Date();
        let user = await this.save(_user);
        if(typeof(user) == 'string')
            throw new Error(user);
        return user;
    }

    async update(_id:string, _user:any){
        try{
            let personModel = new BaseModel(PersonSchema, 'person');
            await personModel.update(_user.person._id, _user.person);
            if( _user.password)
                _user.password = this.encrypt(_user.password)
            return await super.update(_id, _user)
        }catch(error){
            console.log(error)
            return `Error actualizando el usuario ${_user.user_name}`
        }
    }
    
    async verify( _id:string ){
        try{
            let user = await this.get(_id);
            if(!user)
                throw new Error('El usuario que decea activar no existe.')
            user.status = new mongo.ObjectId(USER_STATUS_ENUM.actived);
            await this.update( user._id, user);
            user.password = this.decrypt(user.password);
            return await this.login(user);
        }catch(error){
            console.log(error);
            throw new Error(`Error activando el usuario.`);
        }
    }

    async password_change( _id:string, _user:any ){
        try{
            _user.password = this.encrypt(_user.password);
            
            await this.model.update({ _id: _id }, { $set: { password: _user.password}})
            return {
                result: true,
                message: 'Contraseña modificada correctamente.'
            }
        }catch(error){
            console.log(error)
            throw new Error(`Error actualizando contraseña.`);
        }
    }

    async login( _user:any ){
        try{
            _user.password = this.encrypt(_user.password)
            let roleModel = new BaseModel(RoleSchema, 'role'),
                 users = await this.filter( 
                {
                    user_name: _user.user_name,
                    password: _user.password,
                    status: new mongo.ObjectId(USER_STATUS_ENUM.actived)
                },{
                    'user_name': 1,
                    'type': 1,
                    person: {
                        name: 1,
                        last_name: 1,
                        avatar_url: 1
                    },
                    roles: {
                        _id: 1
                    },
                    setting: {
                        _id: 1
                    }
                },{},
                0,1
            )
            if( users.length == 0)
                throw new ErrorEvent( `El usuario o contraseña no es correcta, verifique los datos`)
            let user = users[0],
                roles = await roleModel.filter({
                _id: { $in: user.roles.map((role:any) =>{ return role._id})}
            }, {
                _id: true,
                name: true,
                'modules.add': true,
                'modules.delete' : true,
                'modules.edit' : true,
                'modules.print' : true,
                'modules.url' : true,
                widgets: {
                    name: true,
                    size: true,
                    order: true
                }
            });
            user.roles = roles;
            return user;
        }catch(error){
            console.log(error)
            throw new Error('A ocurrido un error iniciando sessión.')
        }
    }

    async recover( _user:any){
        let users = await this.filter( {user_name: _user.user_name}, null, null, 0, 1)
        if(users.length <= 0)
            throw new Error(`El usuario ${_user.user_name} no existe en el sistema.`)
        let user = users[0],
            password = `ee${user.user_name} ${new Date().getDate()}`;
        user.password = this.encrypt(password);
        await this.update( user._id, user);
        await this.recover_mail(user.user_name, user._id.toString());
        return user;
    }

    private encrypt (text: string) {
        let cipher = crypto.createCipher(this.algorithm, this.password),
	    crypted = cipher.update(text, 'utf8', 'hex')
        crypted += cipher.final('hex');
        return crypted;
    }

    private decrypt (text: string) {
        let decipher = crypto.createDecipher(this.algorithm, this.password),
	    dec = decipher.update(text, 'hex', 'utf8')
        dec += decipher.final('utf8');
        return dec;
    }
    
    private async welcome_mail(person:IPerson){
        let mailModel = new MailModel(),
            path = join(process.cwd(), 'public', 'mails', 'wellcome.mail.html'),
            template = readFileSync(path, "utf8");

        template = template.replace('{{personName}}', `${person.name} ${person.last_name}`);
        await mailModel.send(null, [person.email], 'Bienvenido a Educate En Linea', template );
    }
    
    private async recover_mail(email:string, user_id:string){
        let mailModel = new MailModel(),
            path = join(process.cwd(), 'public', 'mails', 'recover.mail.html'),
            template = readFileSync(path, "utf8"),
            site_url = config.get('site_url');

        template = template.replace('{{verifyUrl}}', `${site_url}/#/site/security/password/${user_id}/recover`);
        await mailModel.send(null, [email], '[Acción necesaria] Cambia tu clave', template );
    }
    
    private async register_mail(email:string, user_id:string){
        let mailModel = new MailModel(),
            path = join(process.cwd(), 'public', 'mails', 'register.mail.html'),
            template = readFileSync(path, "utf8"),
            site_url = config.get('site_url');

        template = template.replace('{{verifyUrl}}', `${site_url}/#/site/security/user/${user_id}/verify`);
        await mailModel.send(null, [email], '[Acción necesaria] Confirma tu cuenta', template );
    }
}