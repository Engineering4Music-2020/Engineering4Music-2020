"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.index = function (req, res, next) {
    res.render("home", {
        layout: false,
        title: "Home",
        login: req.isAuthenticated(),
    });
};
