"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.index = function (req, res) {
    res.render("data", {
        layout: false,
        title: "Data",
    });
};
