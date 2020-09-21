import { Client } from "pg";
import dotenv from "dotenv";
import { sendMail } from "../../auto-mail/src/mailsender";

dotenv.config();

const raspiId = process.env.RASPI_ID;

const checkData = (latestHumidity: number, latestTemperature: number): boolean => {
    if (latestHumidity > 45 || latestHumidity < 40 || latestTemperature > 25 || latestTemperature < 15) {
        return true;
    } else if (latestHumidity < 50 && latestHumidity > 40 || latestHumidity === undefined || latestTemperature < 25 && latestTemperature > 15 || latestTemperature === undefined) {
        return false;
    } else {
        return false;
    }
};


const connectToDataBaseAndCheckData = async (query: string) => {
    const client = new Client({
        connectionString: process.env.DB_URI,
        ssl: {
            rejectUnauthorized: false
        }
    });
    await client.connect();
    try {
        const result = await client.query(query);
        const rowNumber = result.rowCount - 1;
        const data = await result.rows[rowNumber];
        const latestHumidity = await data.humidity;
        const latestTemperature = await data.temperature;
        let datas: number[] = [latestHumidity, latestTemperature];
        return datas;
    } catch (err) {
        console.log(err);
    } finally {
        await client.end();
    }
};

const query = `SELECT * FROM data WHERE raspiid = ${raspiId} ORDER BY date;`;


export const warnUser = (humidity: number, temperature: number) => {
    if (humidity > 60 || humidity < 40 || temperature > 25 || temperature < 15) {
        connectToDataBaseAndCheckData(query).then((datas: any) => {
            let [humidity, temperature] = datas;
            switch (checkData(humidity, temperature)) {
                case true:
                    console.log("No Mail sent");
                    break;
                case false:
                    sendMail(temperature, humidity);
                    console.log("Mail sent");
                    break;
            }
        })
    } else {
        console.log("Good again");
        connectToDataBaseAndCheckData(query).then((datas: any) => {
            let [humidity, temperature] = datas;
            switch (checkData(humidity, temperature)) {
                case true:
                    sendMail(temperature, humidity);
                    console.log("Mail sent");
                    break;
                case false:
                    console.log("No Mail sent");
                    break;
            }
        })
    }
};

warnUser(50, 20);
