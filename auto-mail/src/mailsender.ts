import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import { temperature_threshold, humidity_threshold } from "../../database/src/warnUser";

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
		msg.html = `The <strong>${type}</strong> in your room is <strong>${value}</strong>. The optimal range for humidity is set between <strong>${humidity_threshold[0]}</strong> and <strong>${humidity_threshold[1]}</strong>.`;
	}

	if (type === "temperature") {
		msg.html = `The ${type} in your room is <strong>${value}</strong>. The optimal range for temperature is set between <strong>${temperature_threshold[0]}</strong> and <strong>${temperature_threshold[1]}</strong>.`;
	}

	sgMail
		.send(msg)
		.catch((error: any) => {
			console.log(error);
		});
};
