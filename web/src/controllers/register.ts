import express, { Request, response, Response } from "express";
import bodyParser from "body-parser";
import { Client, Pool } from "pg";
import dotenv from "dotenv";
import bcrypt, { hash } from "bcrypt";
import flash from "connect-flash";

const app = express();

export const form = (req: Request, res: Response) => {
	res.render("signUp", {
		layout: false,
		title: "Register",
		userData: req.user,
	});
};

dotenv.config();

export const register = (req: Request, res: Response) => {
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.use(flash());
	const plainTextPassword = req.body.password;

	bcrypt
		.hash(plainTextPassword, 10)
		.then((hash) => {
			const raspiId = req.body.raspiId;
			const name = req.body.name;
			const email = req.body.email;
			const password = hash;

			const uploadToDB = async () => {
				const client = new Client({
					connectionString: process.env.DB_URI,
					ssl: {
						rejectUnauthorized: false,
					}
				});
				try {
					await client.connect();
					console.log(`Connected, register`);
					const result = await client.query(
						`SELECT id FROM login WHERE email LIKE '${email}';`
					);
					if (result.rows[0]) {
						req.flash(
							"warning",
							"This email address is already registered. <a href='/loginForm'>Log in!</a>"
						);
						res.redirect("/join");
					} else {
						await client.query(
							`WITH raspberrypi AS (INSERT INTO login VALUES ('${email}', '${password}', ${raspiId}, '${name}')) INSERT INTO raspberrypi VALUES (${raspiId}, '${name}');`,
							(err, result) => {
								if (err) {
									console.log(err);
								} else {
									console.log(result);
									req.flash("success", "User created.");
									return;
								}
							}
						);
					}
				} catch (error) {
					console.log(error);
				} finally {
					await client.end();
					console.log("Disconnected, register");
					res.redirect("/loginForm");
				}
			};
			uploadToDB();
		})
		.catch((error) => {
			console.log(error);
		});
};
