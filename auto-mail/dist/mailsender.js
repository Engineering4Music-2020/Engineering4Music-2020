"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mail_1 = __importDefault(require("@sendgrid/mail"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var apiKey = process.env.SENDGRID;
exports.sendMail = function (temperature, humidity) {
    mail_1.default.setApiKey(apiKey);
    var msg = {
        to: 'michael.schnyder.immer@gmail.com',
        from: 'michael@schnyder.cc',
        subject: 'Watch out!',
        text: 'and easy to do anywhere, even with Node.js',
        html: "<strong>The Humidity in your room is " + humidity + ", and the temperature is " + temperature + "</strong>",
    };
    mail_1.default.send(msg).then(function () {
        console.log("Success");
    })
        .catch(function (error) {
        console.log(error);
    });
};
