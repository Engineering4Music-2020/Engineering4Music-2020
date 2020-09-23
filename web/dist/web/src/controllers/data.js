"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.index = (req, res) => {
    res.render("data", {
        layout: false,
        title: "Data",
    });
};
