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
const main_1 = require("../../sensors/src/main");
const warnUser_1 = require("./warnUser");
const pool_1 = require("./pool");
const checkHowManyRowsThereAreAndIfNecessaryDeleteSome = (checkForRows, deleteRows) => {
    pool_1.pool.connect().then((client) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield client.query(checkForRows);
            const rowNumber = result.rowCount;
            if (rowNumber >= 1000) {
                yield client.query(deleteRows);
                client.release();
                console.log("Rows deleted");
            }
            else {
                client.release();
                console.log("Nothing deleted");
            }
        }
        catch (err) {
            client.release();
            console.log(err.stack);
        }
    }));
};
const fillDataBase = (humidity, temperature, raspiid) => {
    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    let hour = d.getHours();
    let minutes = d.getMinutes();
    console.log(`date '${year}-${month}-${day}' + time '${hour}:${minutes}'`);
    pool_1.pool.connect().then((client) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield client.query(`INSERT INTO data (humidity, temperature, date, raspiid) VALUES(${humidity}, ${temperature}, LOCALTIMESTAMP, ${raspiid});`);
            client.release();
            console.log("Released");
        }
        catch (err) {
            client.release();
            console.log(err.stack);
        }
    }));
};
const checkForRows = `SELECT * FROM data;`;
const deleteRows = `DELETE FROM data where date in (
    select date from data order by date limit 100);`;
const measure = () => {
    checkHowManyRowsThereAreAndIfNecessaryDeleteSome(checkForRows, deleteRows);
    main_1.getData().then((data) => {
        let humidity = data.humidity;
        let temperature = data.temperature;
        // PREVENT ZEROS
        // if (humidity === 0) {
        // 	measure();
        // }
        dotenv_1.default.config();
        if (humidity === 0) {
            measure();
        }
        else {
            const raspiid = process.env.RASPI_ID;
            warnUser_1.warnUser(humidity, temperature);
            fillDataBase(humidity, temperature, raspiid);
        }
    });
};
setInterval(measure, 5000);
