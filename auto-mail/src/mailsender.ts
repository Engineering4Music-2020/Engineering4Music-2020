import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

const apiKey:any = process.env.SENDGRID;

export const sendMail = (temperature:number, humidity:number) => {

    sgMail.setApiKey(apiKey);

    const msg = {
        to: 'michael.schnyder.immer@gmail.com',
    from: 'michael@schnyder.cc',
    subject: 'Watch out!',
    text: 'and easy to do anywhere, even with Node.js',
    html: `<strong>The Humidity in your room is ${humidity}, and the temperature is ${temperature}</strong>`,
    };

sgMail.send(msg).then(() => {
    console.log("Success");
})
.catch((error:any) => {
    console.log(error);
});
}

