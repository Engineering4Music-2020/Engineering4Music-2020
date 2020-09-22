import dotenv from "dotenv";
import { Request, Response } from "express";
import { pool } from "../../../database/src/pool";

dotenv.config();

const createNewClientAndConnectToDatabase = (
	req: Request,
	res: Response,
	query: string
) => {
	pool.connect().then(async (client) => {
		try {
			const result = await client.query(query);
			res.send(JSON.stringify(result));
		} catch (err) {
			client.release();
			throw err;
		} finally {
			client.release();
		}
	})
}

const readData = (res: Response) => {
	pool.connect().then(async (client) => {
		try {
			const result = await client.query(`SELECT * FROM data WHERE id = ${id} ORDER BY date;`);
			console.log(result);
			res.render("data", {
				layout: false,
				data: result.rows,
			});
		} catch (err) {
			throw err;
		} finally {
			client.release();
		}
	})
}

export const loadData = (req: Request, res: Response): void => {
	readData(res);
	console.log(id);
};

export async function loadJSONAll(req: Request, res: Response) {
	const query = `SELECT * FROM data WHERE raspiid = ${id} ORDER BY date;`;
	createNewClientAndConnectToDatabase(req, res, query);
}

export async function loadJSONlast24h(req: Request, res: Response) {
	const query = `SELECT * FROM data WHERE date BETWEEN NOW() - INTERVAL '24 HOURS' AND NOW() AND raspiid = ${id} ORDER BY date;`;
	createNewClientAndConnectToDatabase(req, res, query);
}

export async function loadJSONlast7d(req: Request, res: Response) {
	const query = `SELECT * FROM data WHERE date BETWEEN NOW() - INTERVAL '7 DAYS' AND NOW() AND raspiid = ${id} ORDER BY date;`;
	createNewClientAndConnectToDatabase(req, res, query);
}

export async function loadJSONlast1m(req: Request, res: Response) {
	const query = `SELECT * FROM data WHERE date BETWEEN NOW() - INTERVAL '1 MONTH' AND NOW() AND raspiid = ${id} ORDER BY date;`;
	createNewClientAndConnectToDatabase(req, res, query);
}
