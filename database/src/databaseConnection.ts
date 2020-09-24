import dotenv from "dotenv";
import { getData } from "../../sensors/src/measureData";
import { warnUser } from "./warnUser";
import { pool } from "./pool";

const checkForRows = `SELECT * FROM data;`;
const delete100latestrows = `DELETE FROM data where date in (
    select date from data order by date limit 100);`;

const checkHowManyRowsThereAreAndIfNecessaryDeleteSome = (
	checkForRows: string,
	delete100latestrows: string
) => {
	pool.connect().then(async (client) => {
		try {
			const result = await client.query(checkForRows);
			const rowNumber = result.rowCount;
			if (rowNumber >= 1000) {
				await client.query(delete100latestrows);
			}
		} catch (err) {
			throw err;
		} finally {
			client.release();
		}
	});
};

const fillDataBase = async (
	humidity: number,
	temperature: number,
	raspiid: any
) => {
	try {
		await pool.query(
			`INSERT INTO data (humidity, temperature, date, raspiid) VALUES(${humidity}, ${temperature}, LOCALTIMESTAMP, ${raspiid});`
		);
	} catch (err) {
		throw err;
	}
};

const measure = () => {
	checkHowManyRowsThereAreAndIfNecessaryDeleteSome(
		checkForRows,
		delete100latestrows
	);
	getData().then((data) => {
		let humidity = data.humidity;
		let temperature = data.temperature;

		dotenv.config();

		// PREVENT ZEROS

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
