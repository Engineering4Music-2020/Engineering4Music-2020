import passport from "passport";
import passportLocal from "passport-local";
import { Client } from "pg";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { request } from "express";
import express, { Request } from "express";

dotenv.config();


const client = new Client({
    connectionString: process.env.DB_URI,
    ssl: {
        rejectUnauthorized: false
    }
});


const LocalStrategy = passportLocal.Strategy;



export const initialize = async(passport:any) => {
    const client = new Client({
        connectionString: process.env.DB_URI,
        ssl: {
            rejectUnauthorized: false
        }
    });
    await client.connect();
    console.log("connected");
    
    passport.use(new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    }, (email, password, done) => {
        console.log("bis da");
        
        client.query(`SELECT * FROM login WHERE email LIKE '${email}';`, (err, result) => {
            if(err) {
                throw err;
            } 
            console.log(result.rows[0]);
            if(result.rowCount > 0) {
                const user = result.rows[0];
                console.log("jetzt");
                console.log(user.password);
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
    // await client.end();
    console.log("End");
    passport.serializeUser((user:any, done:any) => {
        done(null, user.id);
    });
    passport.deserializeUser((id:any, done:any) => {
        client.query(`SELECT * FROM login WHERE id = ${id};`, (err, result) => {
            if(err) {
                throw err;
            }
            return done(null, result.rows[0]);
        })
    })
}
    
export default initialize;