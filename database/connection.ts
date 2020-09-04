import { Client } from "pg";
import dotenv from "dotenv";
import { getData } from "../sensors/src/main";

const temp = getData().then((temp) => {
	return temp.toString();
});

dotenv.config();

const client = new Client({
	connectionString: process.env.DB_URI,
	ssl: {
		rejectUnauthorized: false,
	},
});

(async () => {
	await client.connect();
	const res = await client.query(
		`INSERT INTO test VALUES('${(await temp).toString()}');`
	);
	console.log(res.rows); // Hello world!
	await client.end();
})();
