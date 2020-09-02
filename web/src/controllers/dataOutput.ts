import { Request, Response } from "express";
import dotenv from "dotenv";
// import { getData } from "../../../sensors/dist/main";

import { getData } from "../../../sensors/src/main";

// dotenv.config();

export const main = (req: Request, res: Response) => {
	const temp = getData().then((temp) => {
		res.render("main", {
			layout: false,
			body: temp,
		});
	});
};
