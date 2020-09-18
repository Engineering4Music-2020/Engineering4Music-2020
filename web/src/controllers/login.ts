import express, { Request, Response, NextFunction } from "express";
import { Client } from "pg";
import "./passportConfig";
import passport from "passport";
import * as passportLocal from "passport-local";
import request from "request";
const app = express();

export const loginForm = (req: Request, res: Response, next: NextFunction) => {
	res.render("login", {
		layout: false,
		title: "Login",
	});
};

const client = new Client({
	connectionString: process.env.DB_URI,
	ssl: {
		rejectUnauthorized: false,
	},
});
