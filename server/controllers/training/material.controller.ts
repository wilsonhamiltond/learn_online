import { BaseController } from '../base.controller'
import { MaterialModel } from '../../models/training/material.model';
export class MaterialController extends BaseController{
    constructor(){
        let model = new MaterialModel();
        super(model)
        this.document_name = 'material'
    }
}