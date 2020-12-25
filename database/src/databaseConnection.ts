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

const getTemperature = async (): Promise<number> => {
	const result: QueryResult = await pool.query(`SELECT temperature 
	FROM data WHERE date=(
	SELECT MAX(date)
	FROM data
	) AND raspiid = 1;`);
	const data: any = result.rows[0];
	const temperature: number = data.temperature;
	return temperature;
};

const humidityIsZero = (humidity: number): boolean => {
	if (humidity === 0) {
		return true;
	} else {
		return false;
	}
};

const temperatureIsZero = (temperature: number): boolean => {
	if (temperature === 0) {
		return true;
	} else {
		return false;
	}
};

const temperatureBefore = async (): Promise<number | undefined> => {
	let temperatureBefore: unknown = await getTemperature().then((temp) => {
		const loadedTemperature: unknown = temp;
		if (typeof loadedTemperature === "number") {
			return loadedTemperature;
		} else {
			return;
		}
	});
	if (typeof temperatureBefore === "number") {
		return temperatureBefore;
	}
};

const checkIfDataCanBeUploaded = (measuredTemperature: number, loadedTemperature: number, measuredHumidity: number) => {
	const loadedTemperatureIsNotLow: boolean = loadedTemperature > 5;
	if (loadedTemperatureIsNotLow) {
		measure();
	} else {
		uploadAndNotifyUser(measuredTemperature, measuredHumidity);
	}
};

const uploadAndNotifyUser = (humidity: number, temperature: number) => {
	const raspiid = process.env.RASPI_ID;
	warnUser(humidity, temperature);
	fillDataBase(humidity, temperature, raspiid);
};

const preventZerosFromBeingUploaded = (humidity: number, temperature: number) => {
	if (humidityIsZero(humidity)) {
		measure();
	} else if (temperatureIsZero(temperature)) {
		console.log("Temp is zero");
		temperatureBefore().then((result) => {
			if (typeof result === "undefined") {
				uploadAndNotifyUser(humidity, temperature);
			} else {
				checkIfDataCanBeUploaded(temperature, result, humidity);
			}
		});
	} else {
		console.log("Is good");
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
	});
};

setInterval(measure, 900000);