import express, { Request, Response, NextFunction } from "express";
import { Client } from "pg";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import passport from "passport";
import * as passportLocal from "passport-local";
const app = express();
const LocalStrategy = passportLocal.Strategy;
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
            loginActive: true,
            loginFailed: req.body.loginFailed
    });
    console.log(req.body);
};    
    
const client = new Client({
    connectionString: process.env.DB_URI,
    ssl: {
        rejectUnauthorized: false
    }
});

export const initialise = () => {
    passport.use(new LocalStrategy({
        usernameField: "email"
    }, (email, password, done) => {
        client.query(`SELECT * FROM login WHERE email = $1`, [email], (err, result) => {
            if(err) {
                throw err;
            } 
            if(result.rows[0] > 0) {
                const user = result.rows[0];
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) {
                        throw err;
                    }
                    if(isMatch) {
                        return done(null, user)
                    } else {
                        return done(null, false, { message: "Wrong Password!" });
                    }
                })
            } else {
                return done(null, false, { message: "Email is not registered." });
            }
        });
    }));
    passport.serializeUser<any, any>((user, done) => {
        done(null, user.id);
    });
}
    