import { createTransport } from 'nodemailer'
import { get } from 'config';

export class MailModel {
    mail_config:any;

    constructor() {
        this.mail_config = get('mail_config');
    }

    async send(from:string, to:string[], subject:string, html:string) {
        try {
            from = from || this.mail_config.auth.user;
            let transporter = createTransport( this.mail_config ),
                options = {
                    from: from,
                    to: to.join(','),
                    subject: subject,
                    html: html
                };
            
            await transporter.sendMail(options);
        } catch (error) {
            console.log(error);
            throw error.message;
        }
    }
}