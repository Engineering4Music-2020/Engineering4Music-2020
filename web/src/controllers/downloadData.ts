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
                const result = await client.query(`SELECT * FROM data;`);
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

export const loadData = (req: Request, res: Response):void => {
         readData(res);
};

