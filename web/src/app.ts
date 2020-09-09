import express from "express";
import path from "path";
import exphbs from "express-handlebars";

import * as homeController from "./controllers/home";
import * as dataOutputController from "./controllers/dataOutput";
import * as downloadDataController from "./controllers/downloadData";

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

app.get("/", homeController.index);
app.get("/main", dataOutputController.main);
app.get("/data", downloadDataController.loadData);


export default app;
