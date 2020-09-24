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
exports.register = exports.form = void 0;
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
const uploadToDB = (raspiId, name, email, password, res, req) => {
    pool_1.pool.connect().then((client) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield client.query(`SELECT * FROM login WHERE email = '${email}';`);
            const user = result.rows[0];
            if (result.rows[0]) {
                if (user.id == raspiId) {
                    req.flash("err_msg", "This email and this ID have already been registered!");
                    res.redirect("/join");
                }
                else {
                    req.flash("err_msg", "This email has already been registered!");
                    res.redirect("/join");
                }
            }
            else {
                const result = yield client.query(`SELECT * FROM data WHERE raspiid = ${raspiId}`);
                if (result.rows[0]) {
                    req.flash("err_msg", "This ID already belongs to someone else!");
                    res.redirect("/join");
                }
                else {
                    yield client.query(`WITH raspberrypi AS (INSERT INTO login VALUES ('${email}', '${password}', ${raspiId}, '${name}')) INSERT INTO raspberrypi VALUES (${raspiId}, '${name}');`);
                    req.flash("success_msg", "You have been successfully registered. Sign in now!");
                    res.redirect("loginForm");
                }
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
    const raspiId = req.body.raspiId;
    const name = req.body.name;
    const email = req.body.email;
    bcrypt_1.default
        .hash(plainTextPassword, 10)
        .then((hash) => {
        const password = hash;
        uploadToDB(raspiId, name, email, password, res, req);
    })
        .catch((err) => {
        throw err;
    });
};
