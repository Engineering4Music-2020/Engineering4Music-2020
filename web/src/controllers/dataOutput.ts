import { Request, Response } from "express";
import dotenv from "dotenv";
import { getData } from "../../../sensors/src/main";

export const main = (req: Request, res: Response) => {
	const temp = getData().then((data) => {
		res.render("main", {
			layout: false,
			temperature: data.temperature,
			humidity: data.humidity,
			date: data.date.toDateString(),
		});
	});
};
