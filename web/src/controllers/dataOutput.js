"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var main_1 = require("../../../sensors/src/main");
exports.main = function (req, res) {
    var temp = main_1.getData().then(function (data) {
        res.render("main", {
            layout: false,
            temperature: data.temperature,
            humidity: data.humidity,
            date: data.date.toDateString(),
        });
    });
};
