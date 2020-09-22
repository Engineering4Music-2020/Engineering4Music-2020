import dotenv from "dotenv";
import { getData } from "../../sensors/src/main";
import { warnUser } from "./warnUser";
import { pool } from "./pool";

const checkHowManyRowsThereAreAndIfNecessaryDeleteSome = (
	checkForRows: string,
	deleteRows: string
) => {
	pool.connect().then(async (client) => {
		try {
			const result = await client.query(checkForRows);
			const rowNumber = result.rowCount;
			if (rowNumber >= 1000) {
				await client.query(deleteRows);
				client.release();
				console.log("Rows deleted");
			} else {
				client.release();
				console.log("Nothing deleted");
			}
		} catch (err) {
			client.release();
			console.log(err.stack);
		}
	});
};
const fillDataBase = async (
	humidity: number,
	temperature: number,
	raspiid: any
) => {
	let d = new Date();
	let year = d.getFullYear();
	let month = d.getMonth() + 1;
	let day = d.getDate();
	let hour = d.getHours();
	let minutes = d.getMinutes();
	console.log(`date '${year}-${month}-${day}' + time '${hour}:${minutes}'`);

	pool.connect().then(async (client) => {
		try {
			await client.query(
				`INSERT INTO data (humidity, temperature, date, raspiid) VALUES(${humidity}, ${temperature}, LOCALTIMESTAMP, ${raspiid});`
			);
			client.release();
			console.log("Released");
		} catch (err) {
			client.release();
			console.log(err.stack);
		}
	});
};

const checkForRows = `SELECT * FROM data;`;
const deleteRows = `DELETE FROM data where date in (
    select date from data order by date limit 100);`;

const measure = () => {
	checkHowManyRowsThereAreAndIfNecessaryDeleteSome(checkForRows, deleteRows);
	getData().then((data) => {
		let humidity = data.humidity;
		let temperature = data.temperature;

		// PREVENT ZEROS
		// if (humidity === 0) {
		// 	measure();
		// }

		dotenv.config();

		if (humidity === 0) {
			measure();
		} else {
			const raspiid = process.env.RASPI_ID;
			warnUser(humidity, temperature);
			fillDataBase(humidity, temperature, raspiid);
		}
	});
};

setInterval(measure, 5000);
