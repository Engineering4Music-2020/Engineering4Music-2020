import { Client } from "pg";
import dotenv from "dotenv";
import { pool } from "./pool";

dotenv.config();

async function dataToJSON() {
	try {
		console.log(`Trying to connect to Database...`);
		console.log(`Connected.`);
		const result = await pool.query(
			`SELECT array_to_json(array_agg(row_to_json (r))) FROM (SELECT * FROM data) r;`
		);
		console.log(...result.rows);
		console.log(result);
	} catch (error) {
		console.log(error);
	}
}

// dataToJSON();
