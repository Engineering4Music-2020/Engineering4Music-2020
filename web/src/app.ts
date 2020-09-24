import express, { Request, Response, NextFunction } from "express";
import path from "path";
import exphbs from "express-handlebars";
import session from "express-session";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import passport from "passport";
import initialize from "./controllers/passportConfig";
import flash from "express-flash";
dotenv.config();

import * as homeController from "./controllers/home";
import * as downloadDataController from "./controllers/loadDataFromDatabase";
import * as registerController from "./controllers/register";
import * as loginController from "./controllers/login";
import * as passportConfig from "./controllers/passportConfig";

// CREATE EXPRESS SERVER
const app = express();
initialize(passport);
const sessionSecret: any = process.env.SESSION_SECRET;

// EXPRESS CONFIGURATION
const public_path = path.join(__dirname, "../public");
console.log("Public path is " + public_path);
app.use(express.static(public_path));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
	session({
		secret: sessionSecret,
		saveUninitialized: false,
		resave: false,
		name: "Engineering4Music",
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.all("/express-flash", (req: Request, res: Response) => {
	req.flash("success", "This is a flash message");
	res.redirect(301, "/");
});
app.use((req: Request, res: Response, next: NextFunction) => {
	res.locals.success_msg = req.flash("success_msg");
	res.locals.err_msg = req.flash("err_msg");
	res.locals.not_registered_msg = req.flash("not_registered_msg");
	next();
});
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

// PRIMARY APP ROUTES

app.post("/auth", registerController.register);
app.get("/loginForm", passportConfig.checkAuthenticated, loginController.loginForm);
app.get("/join", registerController.form);
app.post("/login", passport.authenticate("local", {
	successRedirect: "/data",
	failureRedirect: "/loginform",
	failureFlash: true,
})
);
app.get("/logout", passportConfig.logout);
app.get("/", homeController.index);
app.get("/home", homeController.index);
app.get("/data", passportConfig.checkNotAuthenticated, downloadDataController.loadData);
app.get("/dataJSONAll", downloadDataController.loadJSONAll);
app.get("/dataJSONlast24h", downloadDataController.loadJSONlast24h);
app.get("/dataJSONlast7d", downloadDataController.loadJSONlast7d);
app.get("/dataJSONlast1m", downloadDataController.loadJSONlast1m);

export default app;
