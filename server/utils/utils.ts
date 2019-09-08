import { Request, Response } from 'express'
import { get } from 'config'

export class Utils {
    constructor() {

    }

    static keepAlive(req: Request, res: Response): boolean {
        if (!req['session'].user) {
            res.status(401).send('Su sessión ha expirado, favor inicio sessión.')
            return false;
        }
        let sessionConfig = get("sessionConfig")
        let hour = sessionConfig['cookie']['maxAge'];
        req['session'].cookie.expires = new Date(Date.now() + hour)
        req['session'].cookie.maxAge = hour
        req['session'].touch();
        return true;
    }

}