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
exports.warnUser = exports.humidity_threshold = exports.temperature_threshold = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const mailsender_1 = require("../../auto-mail/src/mailsender");
dotenv_1.default.config();
const raspiId = process.env.RASPI_ID;
const query = `SELECT humidity, temperature, raspiid, email 
FROM data 
INNER JOIN login 
ON data.raspiid = login.id 
WHERE raspiid = ${raspiId} 
ORDER BY date ASC;`;
exports.temperature_threshold = [24, 26];
exports.humidity_threshold = [40, 50];
const checkLatestMeasurement = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new pg_1.Client({
        connectionString: process.env.DB_URI,
        ssl: {
            rejectUnauthorized: false,
        },
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
function isValueInRange(value, threshold) {
    if (value > threshold[1] || value < threshold[0]) {
        return "out_of_range";
    }
    else {
        return "in_range";
    }
}
function checkToSendMail(status_value_current, status_value_last) {
    if (status_value_current === status_value_last) {
        return { status: false, subject: "undefined" };
    }
    else if (status_value_current === "out_of_range" &&
        status_value_last === "in_range") {
        return { status: true, subject: "out of range" };
    }
    else if (status_value_current === "in_range" &&
        status_value_last === "out_of_range") {
        return { status: true, subject: "in range again" };
    }
    console.log("This shouldn't hapen...");
    return { status: false, subject: "undefined" };
}
exports.warnUser = (humidity_current, temperature_current) => {
    const status_temperature_current = isValueInRange(temperature_current, exports.temperature_threshold);
    const status_humidity_current = isValueInRange(humidity_current, exports.humidity_threshold);
    checkLatestMeasurement(query).then((datas) => {
        let [humidity_last, temperature_last, email] = datas;
        const status_temperature_last = isValueInRange(temperature_last, exports.temperature_threshold);
        const status_humidity_last = isValueInRange(humidity_last, exports.humidity_threshold);
        const sendMailTemperature = checkToSendMail(status_temperature_current, status_temperature_last);
        const sendMailHumidity = checkToSendMail(status_humidity_current, status_humidity_last);
        if (sendMailTemperature.status === true) {
            mailsender_1.sendMail("temperature", temperature_current, sendMailTemperature.subject, email);
        }
        if (sendMailHumidity.status === true) {
            mailsender_1.sendMail("humidity", humidity_current, sendMailHumidity.subject, email);
        }
    });
};
