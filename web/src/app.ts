import express, { Request, Response, NextFunction } from "express";
import path from "path";
import exphbs from "express-handlebars";
import session, { MemoryStore } from "express-session";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { v4 as uuid } from "uuid";

dotenv.config();

import * as aboutController from "./controllers/about";
import * as homeController from "./controllers/home";
import * as dataController from "./controllers/data";
import * as dataOutputController from "./controllers/dataOutput";
import * as downloadDataController from "./controllers/downloadData";
import * as registerController from "./controllers/register";
import * as loginController from "./controllers/login";

/*const RedisStore = connectRedis(session);
const redisOptions = {
    url: "redis://localhost/"
};

const logUrlMiddleware = (req: Request, res: Response, next: () => void) => {
    console.log(req.url);
    next();
}
*/

// Create Express server

const app = express();

// Express configuration

const public_path = path.join(__dirname, "../public");
console.log("Public path is " + public_path);
app.use(express.static(public_path));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
	session({
		genid: (req) => {
			console.log("Inside the session Middleware");
			console.log(req.sessionID);
			return uuid();
		},
		secret: "Bruno",
		saveUninitialized: true,
		resave: false,
	})
);
app.use((req: Request, res: Response, next: () => void) => {
	res.locals.isLoggedIn = req.session !== undefined && req.session.isLoggedIn;
	res.locals.user = req.session !== undefined ? req.session.user : undefined;
	next();
});

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

// Primary app routes.

app.get("/", registerController.form);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.post("/auth", registerController.register);
app.get("/loginForm", loginController.loginForm);
app.get("/join", registerController.form);
app.get("/login", loginController.loginForm);
// app.post("/login", loginController.login);
app.get("/about", aboutController.index);
app.get("/", homeController.index);
app.get("/main", dataOutputController.main);
app.get("/data", dataController.index);
app.get("/home", homeController.index);

// Databank Queries

app.get("/dataJSONAll", downloadDataController.loadJSONAll);
app.get("/dataJSONlast24h", downloadDataController.loadJSONlast24h);
app.get("/dataJSONlast7d", downloadDataController.loadJSONlast7d);
app.get("/dataJSONlast1m", downloadDataController.loadJSONlast1m);
// app.post("/logout", loginController.logout);

export default app;
