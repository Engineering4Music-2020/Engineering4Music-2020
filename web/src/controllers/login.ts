import express, { Request, Response, NextFunction } from "express";
import { Client } from "pg";
import "./passportConfig";
import passport from "passport";
import * as passportLocal from "passport-local";
import request from "request";
const app = express();
/*
passport.serializeUser<any, any>((user, done) => {
    done(undefined, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    })
})
*/
export const loginForm = (req: Request, res: Response, next: NextFunction) => {
        res.render("login", {
            layout: false,
            title: "Login",
    });
    // console.log(req.body);
};    
    
const client = new Client({
    connectionString: process.env.DB_URI,
    ssl: {
        rejectUnauthorized: false
    }
});

/*export const postLogin = (res: Response, req: Request) => {

    passport.authenticate("local", (err: Error,  user) => {
        if(err) {
            return err;
        }
        if(!user) {
            req.flash("errors", "Nicht erkannt");
            return res.redirect("/loginForm");
        }
        req.logIn(user, (err) => {
            if(err) {
                return err;
            }
            req.flash('success', "Logged in successfully");
            res.redirect("/home");
        })
    })(req, res);
}
*/