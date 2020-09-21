import { Client } from "pg";
import dotenv from "dotenv";
import { getData } from "../../sensors/src/main";
import { warnUser } from "./warnUser";
import { pool } from "./pool";

const deleteRows = async (query: string) => {
	try{
		await pool.connect()
		await pool.query(``)
	}
} 

const fillDataBase = async (
	humidity: number,
	temperature: number,
	raspiid: any
) => {
	/*const client = new Client({
		connectionString: process.env.DB_URI,
		ssl: {
			rejectUnauthorized: false,
		},
	});*/

	let d = new Date();
	let year = d.getFullYear();
	let month = d.getMonth() + 1;
	let day = d.getDate();
	let hour = d.getHours();
	let minutes = d.getMinutes();
	console.log(`date '${year}-${month}-${day}' + time '${hour}:${minutes}'`);
	try {
		await pool.connect();
		await pool.query(`SELECT * FROM data ORDER BY date;`).then((result) => {
			const rowNumber = result.rowCount;
			if(rowNumber === 1000) {
				
			}
		})
		const res = await pool.query(
			`INSERT INTO data (humidity, temperature, date, raspiid) VALUES(${humidity}, ${temperature}, LOCALTIMESTAMP, ${raspiid});`
		);
		console.log(res.rows);
	} catch (error) {
		console.log(error);
	} finally {
		console.log("done");
	}
};

const measure = () => {
	getData().then((data) => {
		let humidity = data.humidity;
		let temperature = data.temperature;

		// PREVENT ZEROS
		if (humidity === 0) {
			measure();
		} else {

		dotenv.config();

		const raspiid = process.env.RASPI_ID;
		fillDataBase(humidity, temperature, raspiid);
		warnUser(humidity, temperature);
		}
	});
};

setInterval(measure, 900000);
