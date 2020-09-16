import { Client } from "pg";
import dotenv from "dotenv";
import { Request, Response } from "express";

dotenv.config();

async function readData(res: Response) {
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
		const result = await client.query(`SELECT * FROM data ORDER BY date;`);
		console.log(result);
		res.render("data", {
			layout: false,
			data: result.rows,
		});
	} catch (error) {
		console.log(error);
	} finally {
		await client.end();
		console.log(`Disconnected from Database`);
	}
}

export const loadData = (req: Request, res: Response): void => {
	if(req.session !== undefined) {
		readData(res);
	} else {
		res.redirect("loginForm");
	}
};

export async function loadJSONAll(req: Request, res: Response) {
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
		const result = await client.query(`SELECT * FROM data ORDER BY date;`);
		res.send(JSON.stringify(result));
	} catch (error) {
		console.log(error);
	} finally {
		await client.end();
		console.log(`Disconnected from Database`);
	}
}
export async function loadJSONlast24h(req: Request, res: Response) {
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
		const result = await client.query(
			`SELECT * FROM data WHERE date BETWEEN NOW() - INTERVAL '24 HOURS' AND NOW() ORDER BY date;`
		);
		res.send(JSON.stringify(result));
	} catch (error) {
		console.log(error);
	} finally {
		await client.end();
		console.log(`Disconnected from Database`);
	}
}
export async function loadJSONlast7d(req: Request, res: Response) {
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
		const result = await client.query(
			`SELECT * FROM data WHERE date BETWEEN NOW() - INTERVAL '7 DAYS' AND NOW() ORDER BY date;`
		);
		res.send(JSON.stringify(result));
	} catch (error) {
		console.log(error);
	} finally {
		await client.end();
		console.log(`Disconnected from Database`);
	}
}
export async function loadJSONlast1m(req: Request, res: Response) {
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
		const result = await client.query(
			`SELECT * FROM data WHERE date BETWEEN NOW() - INTERVAL '1 MONTH' AND NOW() ORDER BY date;`
		);
		res.send(JSON.stringify(result));
	} catch (error) {
		console.log(error);
	} finally {
		await client.end();
		console.log(`Disconnected from Database`);
	}
}
