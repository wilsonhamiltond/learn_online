import { Response, Request} from 'express'
import { UserModel } from '../../models/security/user.model'
import { BaseController } from '../base.controller'
import { USER_STATUS_ENUM } from '../../../src/services/security/user.service';
export class UserController extends BaseController{
    model: UserModel;
    constructor(){
        let model = new UserModel();
        super(model)
        this.model = model;
        this.document_name = 'user'
    }

    async setting( req: Request, res:Response){
        try{
            let users:Array<any> = await this.model.filter({name: req.params.name});
            if(users.length > 0)
                res.json({
                    result: true,
                    setting: users[0].setting
                })
            else
                res.json({
                    result: false,
                    message: 'No se encontro la confiruraciรณn.'
                });
        }catch(e){
            res.json({
                result: false,
                message: 'No se encontro la confiruraciรณn.'
            });
        }
    }
    
    async login( req: Request, res:Response){
        try{
            let user:any = req.body,
                result = await this.model['login'](user)
            req['session'].user = result;
            req['session'].cookie.expires =false;
            await req['session'].save()
            res.json( {
                user: result,
                result: true,
                message: `${this.document_name} inicio sessión correctamente.`
            });
        }catch(e){
            res.json( {
                result: false,
                error: e,
                message: e.message
            })
        }
    }
    
    async register( req: Request, res:Response){
        try{
            let _user:any = req.body;
            let user = await this.model.register(_user),
                message = 'Usuario registrado correctamente.';
            if(user.status && user.status.toString() == USER_STATUS_ENUM.inactived)
                message = `Se ha enviado un correo a la dirección ${user.user_name}, el correo contiene un enlace para activar tu usuario.`
            
            req['session'].user = user;
            req['session'].cookie.expires =false;
            await req['session'].save()
            res.json( {
                user: user,
                result: true,
                message: message
            });
        }catch(e){
            res.json( {
                result: false,
                error: e,
                message: e.message
            })
        }
    }

    async verify( req: Request, res:Response){
        try{
            let _id:any = req.params._id,
                user = await this.model.verify(_id);
            res.json( {
                result: true,
                doc: user,
                message: `Usuario activado correctamente.`
            });
        }catch(e){
            res.json( {
                result: false,
                error: e,
                message: e.message
            })
        }
    }

    async logout( req: Request, res:Response){
        let request = {
            session: {
                user: req['session'].user 
            },
            body: {},
            params: {}
        };
        req['session'].destroy();
        res.json({
            result: true,
            message: 'Session cerrada correctamente.'
        });
    }
    
    async password( req: Request, res:Response){
        try{
            let user:any = req.body,
                _id = req.params._id;
            let result = await this.model.password_change(_id, user);
            return res.json(result);
        }catch(e){
            return res.json({
                result: false,
                message: e.message
            })
        }
    }
    
    async check( req: Request, res:Response){
        try{
            let users:Array<any> = await this.model.filter({user_name: req.params.user_name}, {_id: 1}, null, 0, 1);
            if(users.length > 0)
                res.json({
                    result: true,
                    message: `El usuario ${req.params.user_name} esta registrado en nuestra base de datos.`
                })
            else
                res.json({
                    result: false
                });
        }catch(e){
            res.json({
                result: false,
            });
        }
    }
    
    async recover( req: Request, res:Response){
        try{
            let _user:any = req.body;
            let user = await this.model.recover(_user);
            res.json( {
                user: user,
                result: true,
                message: `Se ha reiniciado la contraseña del usuario ${_user.user_name} y se envio un enlace por correo para inicial sessión.`
            });
        }catch(e){
            res.json( {
                result: false,
                error: e,
                message: e.message
            })
        }
    }
}