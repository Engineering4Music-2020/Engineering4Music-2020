import express, { Request, response, Response } from "express";
import bodyParser from "body-parser";
import { Client, Pool } from "pg";
import dotenv from "dotenv";
import bcrypt, { hash } from "bcrypt";
import flash from "connect-flash";
import { pool } from "../../../database/src/pool";

const app = express();

export const form = (req: Request, res: Response) => {
	res.render("signUp", {
		layout: false,
		title: "Register",
		userData: req.user,
	});
};

dotenv.config();

const uploadToDB = async (raspiId: number, name: string, email: string, password: string, res: Response) => {
	await pool.connect();
	try {
		pool.query(`SELECT * FROM login WHERE id = ${raspiId};`).then((result) => {
			if (result.rows[0]) {
				res.redirect("/join");
			} else {
				pool.query(`WITH raspberrypi AS (INSERT INTO login VALUES ('${email}', '${password}', ${raspiId}, '${name}')) INSERT INTO raspberrypi VALUES (${raspiId}, '${name}');`).then((result) => {
					res.redirect("/loginForm");
				}).catch((err) => {
					throw err;
				})
			}
		}).catch((err) => {
			throw err;
		})
	} catch (err) {
		throw err;
	} finally {
		console.log("Pool drained");
	}
}


export const register = (req: Request, res: Response) => {
	const plainTextPassword = req.body.password;

	bcrypt
		.hash(plainTextPassword, 10)
		.then((hash: string) => {
			const raspiId = req.body.raspiId;
			const name = req.body.name;
			const email = req.body.email;
			const password = hash;
			uploadToDB(raspiId, name, email, password, res);
		}).catch((err: any) => {
			throw err;
		})
}