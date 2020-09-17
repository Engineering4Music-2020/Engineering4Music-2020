import { Client } from "pg";
import dotenv from "dotenv";
import { Request, Response } from "express";

dotenv.config();

async function createNewClientAndConnectToDatabase(
	req: Request,
	res: Response,
	query: string
) {
	const client = new Client({
		connectionString: process.env.DB_URI,
		ssl: {
			rejectUnauthorized: false,
		},
	});

	try {
		console.log(`Connecting`);
		await client.connect();
		console.log(`Connected to database`);
		const result = await client.query(query);
		res.send(JSON.stringify(result));
	} catch (error) {
		console.log(error);
	} finally {
		await client.end();
		console.log(`Disconnected from Database`);
	}
}

export async function loadJSONAll(req: Request, res: Response) {
	const query = `SELECT * FROM data ORDER BY date;`;
	createNewClientAndConnectToDatabase(req, res, query);
}

export async function loadJSONlast24h(req: Request, res: Response) {
	const query = `SELECT * FROM data WHERE date BETWEEN NOW() - INTERVAL '24 HOURS' AND NOW() ORDER BY date;`;
	createNewClientAndConnectToDatabase(req, res, query);
}
export async function loadJSONlast7d(req: Request, res: Response) {
	const query = `SELECT * FROM data WHERE date BETWEEN NOW() - INTERVAL '7 DAYS' AND NOW() ORDER BY date;`;
	createNewClientAndConnectToDatabase(req, res, query);
}
export async function loadJSONlast1m(req: Request, res: Response) {
	const query = `SELECT * FROM data WHERE date BETWEEN NOW() - INTERVAL '1 MONTH' AND NOW() ORDER BY date;`;
	createNewClientAndConnectToDatabase(req, res, query);
}
