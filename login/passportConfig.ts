import passportLocal from "passport-local";
import { Client } from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import dotenv from "dotenv";

dotenv.config();


const client = new Client({
    connectionString: process.env.DB_URI,
    ssl: {
        rejectUnauthorized: false
    }
});


const LocalStrategy = passportLocal.Strategy;

const initialize = (passport:any) => {
    passport.use(new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    }, (email:any, password, done) => {
        client.query(`SELECT * FROM login WHERE email LIKE $1;` [email], (err, result) => {
            if(err) {
                throw err;
            }
            console.log(result);
            if(result.rows.length > 0) {
                const user = result.rows[0];

                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) {
                        throw err;
                    } 
                    if(isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: "Wrong Password!" });
                    }
                })
            } else {
                return done(null, false, { message: "Email is not in database!"});
            }
        });
    }));
    passport.serializeuser((user:any, done:any) => done(user.id));
};