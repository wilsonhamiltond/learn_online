import { Response, Request } from 'express'
import { BaseController } from '../base.controller'
import { get } from 'config'
import { BaseModel } from '../../models/base.model';
import { SettingSchema } from '../../schemas/security/setting.schema';
import { ContactSchema } from '../../schemas/security/contact.schema';

export class SettingController extends BaseController {
    model: BaseModel;
    constructor() {
        let model = new BaseModel( SettingSchema, 'setting', {
            upload_name: 'logo'
        });
        super(model)
        this.document_name = 'setting'
    }
    async current(req: Request, res: Response) {
        try {
            let is_saas = get("is_saas");
            if (!is_saas) {
                let settings: Array<any> = await this.model.filter({}, {}, {}, 0, 1);
                if (settings.length > 0) {
                    settings[0].is_saas = is_saas
                    res.json({
                        result: true,
                        doc: settings[0]
                    })
                } else {
                    res.json({
                        result: true,
                        doc: {
                            "_id" : "5b883644443e120a1c8e9878",
                            "name" : "Educate en linea",
                            "description" : "Educacion gratis para todos",
                            "logo" : "assest/images/logo.png",
                            "email" : "info@educateenlinea.com",
                            "latitude" : 18.443968,
                            "longitude" : -69.937209,
                            "zoon" : 17
                        }
                    });
                }
            } else {
                if (req['session'].user) {
                    let setting = await this.model.get(req['session'].user.setting._id)
                    res.json({
                        result: true,
                        doc: setting
                    })
                } else {
                    res.json({
                        result: true,
                        doc: {
                            "_id" : "5b883644443e120a1c8e9878",
                            "name" : "Educate en linea",
                            "description" : "Educacion gratis para todos",
                            "logo" : "assest/images/logo.png",
                            "email" : "info@educateenlinea.com",
                            "latitude" : 18.443968,
                            "longitude" : -69.937209,
                            "zoon" : 17
                        }
                    });
                }
            }
        } catch (error) {
            console.log(error)
            return {
                result: false,
                message: 'Error buscando configuraciรณn por defecto.'
            }
        }
    }

    async contact( req: Request, res:Response){
        try{
            let object:any = req.body,
                contactModel = new BaseModel(ContactSchema, 'contact');
            delete object['_id']
            object.create_date = new Date();  
            let doc = await contactModel.save(object);
            res.json({
                result: true,
                doc: doc,
                message: `${this.document_name} guardado correctamente.`
            })
        }catch(error){
            res.json( {
                result: false,
                error: error,
                message: `Error guardando ${this.document_name}`
            })
        }
    }

}