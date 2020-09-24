"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
const dotenv_1 = __importDefault(require("dotenv"));
const warnUser_1 = require("../../database/src/warnUser");
dotenv_1.default.config();
const apiKey = process.env.API_KEY;
exports.sendMail = (type, value, subject, email) => {
    mail_1.default.setApiKey(apiKey);
    const msg = {
        to: email,
        from: `michael@schnyder.cc`,
        subject: `${type} is ${subject}.`,
        html: `The <strong>${type}</strong> in your room is <strong>${value}</strong>. The optimal range for temperature is between <strong>${warnUser_1.temperature_threshold[0]}</strong> and <strong>${warnUser_1.temperature_threshold[1]}</strong>. The optimal range for humidity is between <strong>${warnUser_1.humidity_threshold[0]}</strong> and <strong>${warnUser_1.humidity_threshold[1]}</strong>.`,
    };
    if (type === "humidity") {
        msg.html = `The <strong>${type}</strong> in your room is <strong>${value}</strong>. The optimal range for humidity is set between <strong>${warnUser_1.humidity_threshold[0]}</strong> and <strong>${warnUser_1.humidity_threshold[1]}</strong>.`;
    }
    if (type === "temperature") {
        msg.html = `The ${type} in your room is <strong>${value}</strong>. The optimal range for temperature is set between <strong>${warnUser_1.temperature_threshold[0]}</strong> and <strong>${warnUser_1.temperature_threshold[1]}</strong>.`;
    }
    mail_1.default
        .send(msg)
        .then(() => {
        console.log(`Mail with subject "${msg.subject}" has been sent.`);
    })
        .catch((error) => {
        console.log(error);
    });
};
