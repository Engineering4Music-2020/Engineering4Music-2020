import { Client } from "pg";
import dotenv from "dotenv";
import { sendMail } from "../../auto-mail/src/mailsender";

dotenv.config();

const raspiId = process.env.RASPI_ID;

const query = `SELECT humidity, temperature, raspiid, email 
FROM data 
INNER JOIN login 
ON data.raspiid = login.id 
WHERE raspiid = ${raspiId} 
ORDER BY date ASC;`;

export const temperature_threshold = [24, 26];
export const humidity_threshold = [40, 50];

const checkLatestMeasurement = async (query: string) => {
	const client = new Client({
		connectionString: process.env.DB_URI,
		ssl: {
			rejectUnauthorized: false,
		},
	});
	await client.connect();
	try {
		const result = await client.query(query);
		const rowNumber = result.rowCount - 1;
		const data = await result.rows[rowNumber];
		const latestHumidity = await data.humidity;
		const email = await data.email;
		const latestTemperature = await data.temperature;
		let datas: number[] = [latestHumidity, latestTemperature, email];
		return datas;
	} catch (err) {
		console.log(err);
	} finally {
		await client.end();
	}
};

function checkValue(value: number, threshold: number[]) {
	if (value > threshold[1] || value < threshold[0]) {
		return "out_of_range";
	} else {
		return "in_range";
	}
}

function checkToSendMail(
	status_value_current: string,
	status_value_last: string
) {
	if (status_value_current === status_value_last) {
		return { status: false, subject: "undefined" };
	} else if (
		status_value_current === "out_of_range" &&
		status_value_last === "in_range"
	) {
		return { status: true, subject: "out of range" };
	} else if (
		status_value_current === "in_range" &&
		status_value_last === "out_of_range"
	) {
		return { status: true, subject: "in range again" };
	}
	console.log("This shouldn't hapen...");
	return { status: false, subject: "undefined" };
}

export const warnUser = (
	humidity_current: number,
	temperature_current: number
) => {
	const status_temperature_current = checkValue(
		temperature_current,
		temperature_threshold
	);
	const status_humidity_current = checkValue(
		humidity_current,
		humidity_threshold
	);
	checkLatestMeasurement(query).then((datas: any) => {
		let [humidity_last, temperature_last, email] = datas;
		const status_temperature_last = checkValue(
			temperature_last,
			temperature_threshold
		);
		const status_humidity_last = checkValue(humidity_last, humidity_threshold);

		const sendMailTemperature = checkToSendMail(
			status_temperature_current,
			status_temperature_last
		);
		const sendMailHumidity = checkToSendMail(
			status_humidity_current,
			status_humidity_last
		);

		if (sendMailTemperature.status === true) {
			sendMail(
				"temperature",
				temperature_current,
				sendMailTemperature.subject,
				email
			);
		}
		if (sendMailHumidity.status === true) {
			sendMail("humidity", humidity_current, sendMailHumidity.subject, email);
		}
	});
};
