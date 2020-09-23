"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginForm = void 0;
const express_1 = __importDefault(require("express"));
require("./passportConfig");
const app = express_1.default();
exports.loginForm = (req, res, next) => {
    res.render("login", {
        layout: false,
        title: "Login",
    });
};
