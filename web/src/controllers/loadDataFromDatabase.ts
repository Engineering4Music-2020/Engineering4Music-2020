import dotenv from "dotenv";
import { Request, Response } from "express";
import { pool } from "../../../database/src/pool";

dotenv.config();

const createNewClientAndConnectToDatabase = async (
	req: Request,
	res: Response,
	query: string
) => {
	try {
		const result = await pool.query(query);
		res.send(JSON.stringify(result));
	} catch (err) {
		throw err;
	}
};

const readData = async (res: Response) => {
	try {
		const result = await pool.query(
			`SELECT * FROM data WHERE id = ${id} ORDER BY date;`
		);
		res.render("data", {
			layout: false,
			data: result.rows,
		});
	} catch (err) {
		throw err;
	}
};

export const loadData = (req: Request, res: Response): void => {
	readData(res);
};

export async function loadJSONAll(req: Request, res: Response) {
	const query = `SELECT * FROM data
	JOIN raspberrypi ON data.raspiid=raspberrypi.id
	WHERE raspiid = ${id}
	ORDER BY date;`;
	createNewClientAndConnectToDatabase(req, res, query);
}

export async function loadJSONlast24h(req: Request, res: Response) {
	const query = `SELECT * FROM data
	JOIN raspberrypi ON data.raspiid=raspberrypi.id
	WHERE date BETWEEN NOW() - INTERVAL '24 HOURS' AND NOW()
	AND raspiid = ${id}
	ORDER BY date;`;
	createNewClientAndConnectToDatabase(req, res, query);
}

export async function loadJSONlast7d(req: Request, res: Response) {
	const query = `SELECT * FROM data
	JOIN raspberrypi ON data.raspiid=raspberrypi.id
	WHERE date BETWEEN NOW() - INTERVAL '7 DAYS' AND NOW()
	AND raspiid = ${id}
	ORDER BY date;`;
	createNewClientAndConnectToDatabase(req, res, query);
}

export async function loadJSONlast1m(req: Request, res: Response) {
	const query = `SELECT * FROM data
	JOIN raspberrypi ON data.raspiid=raspberrypi.id
	WHERE date BETWEEN NOW() - INTERVAL '1 MONTH' AND NOW()
	AND raspiid = ${id}
	ORDER BY date;`;
	createNewClientAndConnectToDatabase(req, res, query);
}
