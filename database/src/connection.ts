import { Client } from "pg";
import dotenv from "dotenv";
import { getData } from "../../sensors/src/main";

const measure = () => {
    let get_data_from_pi_and_update_DB = getData().then((data) => {
        let humidity = data.humidity;
        let temperature = data.temperature;

        dotenv.config();
        
        async function fillDataBase() {
            const client = new Client({
                connectionString: process.env.DB_URI,
                ssl: {
                    rejectUnauthorized: false
                }
            });
            
            let d = new Date();
            let year = d.getFullYear();
            let month = d.getMonth() + 1;
            let day = d.getDate();
            let hour = d.getHours();
            let minutes = d.getMinutes();
            console.log(`date '${year}-${month}-${day}' + time '${hour}:${minutes}'`);
                try {
                    await client.connect();
                    const res = await client.query(`INSERT INTO data VALUES(${humidity}, ${temperature}, 1009, date '${year}-${month}-${day}' + time '${hour}:${minutes}');`);
                    console.log(res.rows);
                } catch(error) {
                    console.log(error);
                } finally {
                    client.end();
                }
            }   
            fillDataBase();
    });
}
setInterval(measure, 300000);

