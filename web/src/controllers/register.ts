import express, { Request, response, Response} from "express";
import session from "express-session";
import bodyParser from "body-parser";
import path from "path";
import { Client } from "pg";
import dotenv from "dotenv";
import bcrypt, { hash } from "bcrypt";

const app = express();




export const form = (req: Request, res: Response) => {
    res.render("signUp", {
        layout: false,
        title: "Login Form"
    });
};

dotenv.config();

export const register = (req: Request, res: Response) => {
    
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    const plainTextPassword = req.body.password;

    bcrypt.hash(plainTextPassword, 10).then((hash) => {
        const raspiId = req.body.raspiId;
        const name = req.body.name;
        const email = req.body.email;
        const password = hash;


        const uploadToDB = async() => {
            const client = new Client({
                connectionString: process.env.DB_URI,
                ssl: {
                    rejectUnauthorized: false
                }
            });
            try {
                await client.connect();
                console.log(`Connected`);
                await client.query(`INSERT INTO login VALUES('${email}', '${password}', ${raspiId}, '${name}');`);
            } catch(error) {
                console.log(error);
            } finally {
                await client.end();
            }
        }
        uploadToDB();
    }).catch((error) => {
        console.log(error);
    });
    res.redirect("/home");
}