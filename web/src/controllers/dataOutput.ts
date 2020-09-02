import { Request, Response } from "express";
import { GrovePi } from "../../../sensors/src/sensors";
import { getData } from '../../../sensors/src/main';

const sensor = new GrovePi(1);
const data = getData();


/**
 * GET /
 * Home page.
 */
export const main = (req: Request, res: Response) => {
	const temp = sensor.measureTemperature()
	.then((temp) => { 	
		res.render("main", {
        body: temp
		});
	});
};