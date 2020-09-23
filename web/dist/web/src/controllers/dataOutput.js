"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const main_1 = require("../../../sensors/src/main");
exports.main = (req, res) => {
    console.log(name);
    const temp = main_1.getData().then((data) => {
        res.render("main", {
            layout: false,
            temperature: data.temperature,
            humidity: data.humidity,
            date: data.date.toDateString(),
        });
    });
};
