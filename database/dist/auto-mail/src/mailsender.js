"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mail_1 = __importDefault(require("@sendgrid/mail"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const apiKey = process.env.API_KEY;
exports.sendWarning = (temperature, humidity, email) => {
    mail_1.default.setApiKey(apiKey);
    const msg = {
        to: email,
        from: 'michael@schnyder.cc',
        subject: 'Watch out!',
        text: 'and easy to do anywhere, even with Node.js',
        html: `<strong>The Humidity in your room is ${humidity}, and the temperature is ${temperature}</strong>`,
    };
    mail_1.default.send(msg).then(() => {
        console.log("Success");
    })
        .catch((error) => {
        console.log(error);
    });
};
exports.sendAllClear = (temperature, humidity, email) => {
    mail_1.default.setApiKey(apiKey);
    const msg = {
        to: email,
        from: 'michael@schnyder.cc',
        subject: 'All-Clear',
        text: 'and easy to do anywhere, even with Node.js',
        html: `<strong>The Humidity in your room has gone back to ${humidity}, and the temperature is now ${temperature}.</strong>`,
    };
    mail_1.default.send(msg).then(() => {
        console.log("Success");
    })
        .catch((error) => {
        console.log(error);
    });
};
