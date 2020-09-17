import express, { Request, Response, NextFunction, request } from "express";
import path from "path";
import exphbs from "express-handlebars";
import session, { MemoryStore } from "express-session";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import passport from "passport";
import initialize from "./controllers/passportConfig";
import flash from "connect-flash";
dotenv.config();



import * as aboutController from "./controllers/about";
import * as homeController from "./controllers/home";
import * as dataOutputController from "./controllers/dataOutput";
import * as downloadDataController from "./controllers/downloadData";
import * as registerController from "./controllers/register";
import * as loginController from "./controllers/login"; 
import * as passportConfig from "./controllers/passportConfig";



// Create Express server
const app = express();
initialize(passport);

// Express configuration
const public_path = path.join(__dirname, "../public");
console.log("Public path is " + public_path);
app.use(express.static(public_path));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
    // store: new FileStore(),
    secret: 'Bruno',
    saveUninitialized: false,
    resave: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

// Primary app routes.

app.post("/auth", registerController.register);
app.get("/loginForm", passportConfig.checkAuthenticated, loginController.loginForm);
app.get("/join", registerController.form);
// app.post("/login", loginController.postLogin);
// app.post("/login", passportConfig.initialize);
app.post("/login", passport.authenticate("local", {
      successRedirect: "/data",
      failureRedirect: "/loginform",
      failureFlash: true
    })
  );
app.get("/about", aboutController.index);
app.get("/", homeController.index);
app.get("/main", dataOutputController.main);
app.get("/data", passportConfig.checkNotAuthenticated, downloadDataController.loadData);
app.get("/dataJSONAll", downloadDataController.loadJSONAll);
app.get("/dataJSONlast24h", downloadDataController.loadJSONlast24h);
app.get("/dataJSONlast7d", downloadDataController.loadJSONlast7d);
app.get("/dataJSONlast1m", downloadDataController.loadJSONlast1m);

export default app;
