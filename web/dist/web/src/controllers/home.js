"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.index = void 0;
exports.index = (req, res, next) => {
    res.render("home", {
        layout: false,
        title: "Home",
        login: req.isAuthenticated(),
    });
};
