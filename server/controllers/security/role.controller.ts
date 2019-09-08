import { RoleModel } from '../../models/security/role.model'
import { BaseController } from '../base.controller'

export class RoleController extends BaseController{
    constructor(){
        let model = new RoleModel();
        super(model)
        this.document_name = 'role'
    }
}