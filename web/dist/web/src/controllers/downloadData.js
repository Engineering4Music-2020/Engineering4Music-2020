"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const pool_1 = require("../../../database/src/pool");
dotenv_1.default.config();
const createNewClientAndConnectToDatabase = (req, res, query) => {
    pool_1.pool.connect().then((client) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield client.query(query);
            res.send(JSON.stringify(result));
        }
        catch (err) {
            client.release();
            throw err;
        }
        finally {
            client.release();
        }
    }));
};
const readData = (res) => {
    pool_1.pool.connect().then((client) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield client.query(`SELECT * FROM data WHERE id = ${id} ORDER BY date;`);
            console.log(result);
            res.render("data", {
                layout: false,
                data: result.rows,
            });
        }
        catch (err) {
            throw err;
        }
        finally {
            client.release();
        }
    }));
};
exports.loadData = (req, res) => {
    readData(res);
    console.log(id);
};
function loadJSONAll(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `SELECT * FROM data WHERE raspiid = ${id} ORDER BY date;`;
        createNewClientAndConnectToDatabase(req, res, query);
    });
}
exports.loadJSONAll = loadJSONAll;
function loadJSONlast24h(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `SELECT * FROM data WHERE date BETWEEN NOW() - INTERVAL '24 HOURS' AND NOW() AND raspiid = ${id} ORDER BY date;`;
        createNewClientAndConnectToDatabase(req, res, query);
    });
}
exports.loadJSONlast24h = loadJSONlast24h;
function loadJSONlast7d(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `SELECT * FROM data WHERE date BETWEEN NOW() - INTERVAL '7 DAYS' AND NOW() AND raspiid = ${id} ORDER BY date;`;
        createNewClientAndConnectToDatabase(req, res, query);
    });
}
exports.loadJSONlast7d = loadJSONlast7d;
function loadJSONlast1m(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `SELECT * FROM data WHERE date BETWEEN NOW() - INTERVAL '1 MONTH' AND NOW() AND raspiid = ${id} ORDER BY date;`;
        createNewClientAndConnectToDatabase(req, res, query);
    });
}
exports.loadJSONlast1m = loadJSONlast1m;
