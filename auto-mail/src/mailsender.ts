import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

const apiKey:any = process.env.API_KEY;

export const sendWarning = (temperature:number, humidity:number) => {

    sgMail.setApiKey(apiKey);

    const msg = {
        to: 'michael.schnyder.immer@gmail.com',
    from: 'michael@schnyder.cc',
    subject: 'Watch out!',
    text: 'and easy to do anywhere, even with Node.js',
    html: `<strong>The Humidity in your room is ${humidity}, and the temperature is ${temperature}.</strong>`,
    };

sgMail.send(msg).then(() => {
    console.log("Success");
})
.catch((error:any) => {
    console.log(error);
});
};

export const sendAllClear = (temperature:number, humidity:number) => {
    sgMail.setApiKey(apiKey);

    const msg = {
    to: 'michael.schnyder.immer@gmail.com',
    from: 'michael@schnyder.cc',
    subject: 'All-Clear',
    text: 'and easy to do anywhere, even with Node.js',
    html: `<strong>The Humidity in your room has gone back to ${humidity}, and the temperature is now ${temperature}.</strong>`,
    };

sgMail.send(msg).then(() => {
    console.log("Success");
})
.catch((error:any) => {
    console.log(error);
});
};