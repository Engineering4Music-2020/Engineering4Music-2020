import Mailgun from "mailgun";
import dotenv from "dotenv";

dotenv.config();

const mg = new Mailgun(process.env.MAILGUN_KEY);

mg.sendText(process.env.MAILGUN_DOMAIN,
    ['michael@schnyder.cc'],
    'Hello',
    'Hello World',
    function(err:any) {
        err && console.log(err)
    });