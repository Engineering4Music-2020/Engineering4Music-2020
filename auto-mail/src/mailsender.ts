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
		html: `The <strong>${type}</strong> in your room is <strong>${value}</strong>. The optimal range for temperature is between <strong>${temperature_threshold[0]}</strong> and <strong>${temperature_threshold[1]}</strong>. The optimal range for humidity is between <strong>${humidity_threshold[0]}</strong> and <strong>${humidity_threshold[1]}</strong>.`,
	};

	if (type === "humidity") {
		msg.html = `The ${type} in your room is ${value}. The optimal range for humidity is set between ${humidity_threshold[0]} and ${humidity_threshold[1]}.`;
	}
	if (type === "temperature") {
		msg.html = `The ${type} in your room is <strong>${value}</strong>. The optimal range for temperature is set between <strong>${temperature_threshold[0]}</strong> and <strong>${temperature_threshold[1]}</strong>.`;
	}

	sgMail
		.send(msg)
		.then(() => {
			console.log(`Mail with subject "${msg.subject}" has been sent.`);
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
