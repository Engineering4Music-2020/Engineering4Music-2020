import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

const apiKey:any = process.env.SENDGRID;

sgMail.setApiKey(apiKey);

export const sendMail = () => {
    const mg = {
        to: 'michael.schnyder.immer@gmail.com',
    from: 'michael@schnyder.cc',
    subject: 'Sending with Twilio SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };

sgMail.send(msg).then(() => {
    console.log("Success");
})
.catch((error:any) => {
    console.log(error);
});
}
