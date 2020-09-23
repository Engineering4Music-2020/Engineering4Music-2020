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
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const mailsender_1 = require("../../auto-mail/src/mailsender");
dotenv_1.default.config();
const raspiId = process.env.RASPI_ID;
const checkData = (latestHumidity, latestTemperature) => {
    if ((latestHumidity > 60 || latestHumidity < 40) && (latestTemperature > 25 || latestTemperature < 15)) {
        return true;
    }
    else {
        return false;
    }
};
const connectToDataBaseAndCheckData = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new pg_1.Client({
        connectionString: process.env.DB_URI,
        ssl: {
            rejectUnauthorized: false
        }
    });
    yield client.connect();
    try {
        const result = yield client.query(query);
        const rowNumber = result.rowCount - 1;
        const data = yield result.rows[rowNumber];
        const latestHumidity = yield data.humidity;
        const email = yield data.email;
        const latestTemperature = yield data.temperature;
        let datas = [latestHumidity, latestTemperature, email];
        return datas;
    }
    catch (err) {
        console.log(err);
    }
    finally {
        yield client.end();
    }
});
const query = `SELECT humidity, temperature, raspiid, email 
FROM data 
INNER JOIN login 
ON data.raspiid = login.id 
WHERE raspiid = ${raspiId} 
ORDER BY date ASC;`;
exports.warnUser = (humidity, temperature) => {
    if (humidity > 60 || humidity < 40 || temperature > 25 || temperature < 15) {
        connectToDataBaseAndCheckData(query).then((datas) => {
            let [humidity, temperature, email] = datas;
            switch (checkData(humidity, temperature)) {
                case true:
                    console.log("No Mail sent");
                    break;
                case false:
                    mailsender_1.sendWarning(temperature, humidity, email);
                    console.log("Mail sent");
                    break;
            }
        });
    }
    else {
        console.log("Good again");
        connectToDataBaseAndCheckData(query).then((datas) => {
            let [humidity, temperature, email] = datas;
            switch (checkData(humidity, temperature)) {
                case true:
                    mailsender_1.sendAllClear(temperature, humidity, email);
                    console.log("Mail sent");
                    break;
                case false:
                    console.log("No Mail sent");
                    break;
            }
        });
    }
};
