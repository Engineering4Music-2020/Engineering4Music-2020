import dotenv from "dotenv";
import { pool } from "./pool";

dotenv.config();

async function dataToJSON() {
	try {
		const result = await pool.query(
			`SELECT array_to_json(array_agg(row_to_json (r))) FROM (SELECT * FROM data) r;`
		);
	} catch (error) {
		console.log(error);
	}
}
