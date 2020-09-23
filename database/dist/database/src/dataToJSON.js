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
dotenv_1.default.config();
function dataToJSON() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new pg_1.Client({
            connectionString: process.env.DB_URI,
            ssl: {
                rejectUnauthorized: false,
            },
        });
        try {
            console.log(`Trying to connect to Database...`);
            yield client.connect();
            console.log(`Connected.`);
            const result = yield client.query(`SELECT array_to_json(array_agg(row_to_json (r))) FROM (SELECT * FROM data) r;`);
            console.log(...result.rows);
            console.log(result);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            yield client.end();
            console.log(`Disconnected.`);
        }
    });
}
// dataToJSON();
