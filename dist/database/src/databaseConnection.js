"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const measureData_1 = require("../../sensors/src/measureData");
const pool_1 = require("./pool");
const checkForRows = `SELECT * FROM data;`;
const delete100latestrows = `DELETE FROM data where date in (
    select date from data order by date limit 100);`;
const checkHowManyRowsThereAreAndIfNecessaryDeleteSome = (checkForRows, delete100latestrows) => {
    pool_1.pool.connect().then((client) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield client.query(checkForRows);
            const rowNumber = result.rowCount;
            if (rowNumber >= 1000) {
                yield client.query(delete100latestrows);
            }
        }
        catch (err) {
            throw err;
        }
        finally {
            client.release();
        }
    }));
};
const fillDataBase = (humidity, temperature, raspiid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield pool_1.pool.query(`INSERT INTO data (humidity, temperature, date, raspiid) VALUES(${humidity}, ${temperature}, LOCALTIMESTAMP, ${raspiid});`);
    }
    catch (err) {
        throw err;
    }
});
const getTemperature = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pool_1.pool.query(`SELECT temperature 
	FROM data WHERE date=(
	SELECT MAX(date)
	FROM data
	) AND raspiid = 1;`);
    const data = result.rows[0];
    const temperature = data.temperature;
    return temperature;
});
const humidityIsZero = (humidity) => {
    if (humidity === 0) {
        return true;
    }
    else {
        return false;
    }
};
const temperatureIsZero = (temperature) => {
    if (temperature === 0) {
        return true;
    }
    else {
        return false;
    }
};
const temperatureBefore = () => {
    let temperatureBefore = getTemperature().then((temp) => {
        const loadedTemperature = temp;
        if (typeof loadedTemperature === "number") {
            return loadedTemperature;
        }
        else {
            return;
        }
    });
    if (typeof temperatureBefore === "number") {
        return temperatureBefore;
    }
};
const preventZerosFromBeingUploaded = (humidity, temperature) => {
    if (humidityIsZero(humidity)) {
        measure();
    }
    else if (temperatureIsZero(temperature)) {
    }
};
// const preventZerosFromBeingUploaded = (humidity: number, temperature: number) => {
// 	if (humidity === 0) {
// 		measure();
// 	} else {
// 		const raspiid = process.env.RASPI_ID;
// 		warnUser(humidity, temperature);
// 		fillDataBase(humidity, temperature, raspiid);
// 	}
// };
const measure = () => {
    checkHowManyRowsThereAreAndIfNecessaryDeleteSome(checkForRows, delete100latestrows);
    measureData_1.getData().then((data) => {
        let humidity = data.humidity;
        let temperature = data.temperature;
        dotenv_1.default.config();
        preventZerosFromBeingUploaded(humidity, temperature);
    });
};
// setInterval(measure, 5000);
console.log(temperatureBefore());
