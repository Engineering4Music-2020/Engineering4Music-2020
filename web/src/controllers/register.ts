import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bcrypt, { hash } from "bcrypt";
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

const uploadToDB = (
	raspiId: number,
	name: string,
	email: string,
	password: string,
	res: Response,
	req: Request
) => {
	pool.connect().then(async (client) => {
		try {
			const result = await client.query(
				`SELECT * FROM login WHERE email = '${email}';`
			);
			const user = result.rows[0];
			if (result.rows[0]) {
				if (user.id == raspiId) {
					req.flash(
						"err_msg",
						"This email and this ID have already been registered!"
					);
					res.redirect("/join");
				} else {
					req.flash("err_msg", "This email has already been registered!");
					res.redirect("/join");
				}
			} else {
				const result = await client.query(
					`SELECT * FROM login WHERE id = ${raspiId}`
				);
				if (result.rows[0]) {
					req.flash("err_msg", "This ID already belongs to someone else!");
					res.redirect("/join");
				} else {
					await client.query(
						`WITH raspberrypi AS (INSERT INTO login VALUES ('${email}', '${password}', ${raspiId}, '${name}')) INSERT INTO raspberrypi VALUES (${raspiId}, '${name}');`
					);
					req.flash(
						"success_msg",
						"You have been successfully registered. Sign in now!"
					);
					res.redirect("loginForm");
				}
			}
		} catch (err) {
			throw err;
		} finally {
			client.release();
		}
	});
};

export const register = (req: Request, res: Response) => {
	const plainTextPassword = req.body.password;
	const raspiId = req.body.raspiId;
	const name = req.body.name;
	const email = req.body.email;
	bcrypt
		.hash(plainTextPassword, 10)
		.then((hash: string) => {
			const password = hash;
			uploadToDB(raspiId, name, email, password, res, req);
		})
		.catch((err: any) => {
			throw err;
		});
};
