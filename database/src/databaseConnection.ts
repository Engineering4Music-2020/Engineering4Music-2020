import dotenv from "dotenv";
import { getData } from "../../sensors/src/measureData";
import { warnUser } from "./warnUser";
import { pool } from "./pool";
import { QueryResult } from "pg";

dotenv.config();

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

const getPreviouslyMeasuredTemperature = async (): Promise<number> => {
	const raspiid = process.env.RASPI_ID;
	try {
		const result: QueryResult = await pool.query(`SELECT temperature 
		FROM data WHERE date=(
		SELECT MAX(date)
		FROM data
		) AND raspiid = ${raspiid};`);
		const defaultValue: number = 0;
		const userHasNoValuesSaved: boolean = result.rowCount === 0;
		if (userHasNoValuesSaved) {
			return defaultValue;
		} else {
			const data: any = result.rows[0];
			const temperature: number = data.temperature;
			return temperature;
		}
	} catch (error) {
		throw error;
	}
};

const uploadAndNotifyUser = (humidity: number, temperature: number) => {
	const raspiid = process.env.RASPI_ID;
	warnUser(humidity, temperature);
	fillDataBase(humidity, temperature, raspiid).catch((error) => console.log(error));
};

const checkIfDataCanBeUploaded = (measuredTemperature: number, loadedTemperature: number, measuredHumidity: number) => {
	const loadedTemperatureIsNotLow: boolean = loadedTemperature > 5;
	if (loadedTemperatureIsNotLow) {
		measure();
	} else {
		uploadAndNotifyUser(measuredTemperature, measuredHumidity);
	}
};

const preventZerosFromBeingUploaded = (humidity: number, temperature: number) => {
	const humidityIsZero: boolean = humidity === 0;
	const temperatureIsZero: boolean = temperature === 0;
	if (humidityIsZero) {
		measure();
	} else if (temperatureIsZero) {
		getPreviouslyMeasuredTemperature().then((previousTemperature) => {
			checkIfDataCanBeUploaded(temperature, previousTemperature, humidity);
		}).catch((error) => console.log(error));
	} else if (humidityIsZero && temperatureIsZero) {
		measure();
	}
	else {
		uploadAndNotifyUser(humidity, temperature);
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

		console.log(data);

		preventZerosFromBeingUploaded(humidity, temperature);
	}).catch((error) => console.log(error));
};

setInterval(measure, 900000);