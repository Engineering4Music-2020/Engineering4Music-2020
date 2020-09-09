import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

async function dataToJSON() {
	const client = new Client({
		connectionString: process.env.DB_URI,
		ssl: {
			rejectUnauthorized: false,
		},
	});

	try {
		console.log(`Trying to connect to Database...`);
		await client.connect();
		console.log(`Connected.`);
		const result = await client.query(
			`SELECT array_to_json(array_agg(row_to_json (r))) FROM (SELECT * FROM data) r;`
		);
		console.log(...result.rows);
		console.log(result);
	} catch (error) {
		console.log(error);
	} finally {
		await client.end();
		console.log(`Disconnected.`);
	}
}

// dataToJSON();
