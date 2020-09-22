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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const pool_1 = require("../../../database/src/pool");
const app = express_1.default();
exports.form = (req, res) => {
    res.render("signUp", {
        layout: false,
        title: "Register",
        userData: req.user,
    });
};
dotenv_1.default.config();
/*const uploadToDB = async (raspiId: number, name: string, email: string, password: string, res: Response) => {
    await pool.connect();
    try {
        pool.query(`SELECT * FROM login WHERE id = ${raspiId};`).then((result) => {
            if (result.rows[0]) {
                res.redirect("/join");
            } else {
                pool.query(`WITH raspberrypi AS (INSERT INTO login VALUES ('${email}', '${password}', ${raspiId}, '${name}')) INSERT INTO raspberrypi VALUES (${raspiId}, '${name}');`).then((result) => {
                    res.redirect("/loginForm");
                }).catch((err) => {
                    throw err;
                })
            }
        }).catch((err) => {
            throw err;
        })
    } catch (err) {
        throw err;
    } finally {
        console.log("Pool drained");
    }
}*/
const uploadToDB = (raspiId, name, email, password, res) => {
    pool_1.pool.connect().then((client) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield client.query(`SELECT * FROM login WHERE id = ${raspiId};`);
            if (result.rows[0]) {
                res.redirect("/loginForm");
                // Message: This email is already registered.
            }
            else {
                yield client.query(`WITH raspberrypi AS (INSERT INTO login VALUES ('${email}', '${password}', ${raspiId}, '${name}')) INSERT INTO raspberrypi VALUES (${raspiId}, '${name}');`);
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
exports.register = (req, res) => {
    const plainTextPassword = req.body.password;
    bcrypt_1.default
        .hash(plainTextPassword, 10)
        .then((hash) => {
        const raspiId = req.body.raspiId;
        const name = req.body.name;
        const email = req.body.email;
        const password = hash;
        uploadToDB(raspiId, name, email, password, res);
    }).catch((err) => {
        throw err;
    });
};
