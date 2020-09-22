import express, { Request, Response, NextFunction } from "express";
import "./passportConfig";
const app = express();

export const loginForm = (req: Request, res: Response, next: NextFunction) => {
	res.render("login", {
		layout: false,
		title: "Login",
	});
};
