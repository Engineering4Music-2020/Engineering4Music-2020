import express, { Request, Response} from "express";
import path from "path";
import exphbs from "express-handlebars";
import session from "express-session";
import bodyParser from "body-parser";


import * as aboutController from "./controllers/about";
import * as homeController from "./controllers/home";
import * as dataOutputController from "./controllers/dataOutput";
import * as downloadDataController from "./controllers/downloadData";
import * as registerController from "./controllers/register";

// Create Express server
const app = express();

// Express configuration
const public_path = path.join(__dirname, "../public");
console.log("Public path is " + public_path);
app.use(express.static(public_path));
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

// Primary app routes.

app.get("/", registerController.form);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.post("/auth", registerController.register);
app.get("/about", aboutController.index);
app.get("/home", homeController.index);
app.get("/main", dataOutputController.main);
app.get("/data", downloadDataController.loadData);
app.get("/dataJSON", downloadDataController.loadJSON);
app.get("/dataJSONlast24h", downloadDataController.loadJSONlast24h);

// Login and Registration

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

export default app;
