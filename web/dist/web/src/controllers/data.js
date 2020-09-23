"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.index = void 0;
exports.index = (req, res) => {
    res.render("data", {
        layout: false,
        title: "Data",
    });
};
