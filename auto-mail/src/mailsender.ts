import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import {
	temperature_threshold,
	humidity_threshold,
} from "../../database/src/warnUser";

dotenv.config();

const apiKey: any = process.env.API_KEY;

export const sendMail = (
	type: string,
	value: number,
	subject: string,
	email: string
) => {
	sgMail.setApiKey(apiKey);

	const msg = {
		to: email,
		from: `michael@schnyder.cc`,
		subject: `${type} is ${subject}.`,
		// text: `and easy to do anywhere, even with Node.js`,
		html: `The ${type} in your room is ${value}. The optimal range for temperature is between ${temperature_threshold[0]} and ${temperature_threshold[1]}. The optimal range for humidity is between ${humidity_threshold[0]} and ${humidity_threshold[1]}.`,
	};

	sgMail
		.send(msg)
		.then(() => {
			console.log(`Mail with subject ${msg.subject} has been sent.`);
		})
		.catch((error: any) => {
			console.log(error);
		});
};

// export const sendWarning = (temperature: number, humidity: number, email: string) => {

//     sgMail.setApiKey(apiKey);

//     const msg = {
//         to: email,
//         from: `michael@schnyder.cc`,
//         subject: `Watch out!`,
//         // text: `and easy to do anywhere, even with Node.js`,
//         html: `<strong>The Humidity in your room is ${humidity}, and the temperature is ${temperature}</strong>`,
//     };

//     sgMail.send(msg).then(() => {
//         console.log("Success");
//     })
//         .catch((error: any) => {
//             console.log(error);
//         });
// }

// export const sendAllClear = (temperature: number, humidity: number, email: string) => {
//     sgMail.setApiKey(apiKey);

//     const msg = {
//         to: email,
//         from: 'michael@schnyder.cc',
//         subject: 'All-Clear',
//         text: 'and easy to do anywhere, even with Node.js',
//         html: `<strong>The Humidity in your room has gone back to ${humidity}, and the temperature is now ${temperature}.</strong>`,
//     };

//     sgMail.send(msg).then(() => {
//         console.log("Success");
//     })
//         .catch((error: any) => {
//             console.log(error);
//         });
// };
