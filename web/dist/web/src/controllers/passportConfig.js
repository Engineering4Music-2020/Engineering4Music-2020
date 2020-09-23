"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_local_1 = __importDefault(require("passport-local"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const pool_1 = require("../../../database/src/pool");
dotenv_1.default.config();
const LocalStrategy = passport_local_1.default.Strategy;
exports.initialize = (passport) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("connected passport");
    passport.use(new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
    }, (req, email, password, done) => {
        pool_1.pool.query(`SELECT * FROM login WHERE email LIKE '${email}';`, (err, result) => {
            if (err) {
                throw err;
            }
            if (result.rowCount > 0) {
                const user = result.rows[0];
                global.id = user.id;
                bcrypt_1.default.compare(password, user.password, (err, isMatch) => {
                    if (err) {
                        throw err;
                    }
                    if (isMatch) {
                        return done(null, user);
                    }
                    else {
                        return done(null, false, req.flash("err_msg", "Wrong Password!"));
                    }
                });
            }
            else {
                return done(null, false, req.flash("not_registered_msg", "Click here to register."));
            }
        });
    }));
    passport.serializeUser((user, done) => {
        done(null, user.id, user.name);
    });
    passport.deserializeUser((id, done) => {
        pool_1.pool.query(`SELECT * FROM login WHERE id = ${id};`, (err, result) => {
            if (err) {
                throw err;
            }
            return done(null, result.rows[0]);
        });
    });
});
exports.checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        // document.getElementById("logout").setAttribute("class") = "visible";
        return res.redirect("data" + { user: req.user } + { id });
    }
    next();
};
exports.checkNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/loginForm");
};
exports.logout = (req, res) => {
    req.logout();
    res.redirect("/");
    req.flash("info", "You have logged out successfully.");
};
const message = (req, res) => {
    res.render("loginForm", {
        layout: false,
        expressFlash: req.flash("success"), sessionFlash: res.locals.sessionFlash
    });
};
exports.default = exports.initialize;
