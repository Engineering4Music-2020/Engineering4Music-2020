"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const express_handlebars_1 = __importDefault(require("express-handlebars"));
const express_session_1 = __importDefault(require("express-session"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
const passportConfig_1 = __importDefault(require("./controllers/passportConfig"));
const express_flash_1 = __importDefault(require("express-flash"));
dotenv_1.default.config();
const aboutController = __importStar(require("./controllers/about"));
const homeController = __importStar(require("./controllers/home"));
const dataOutputController = __importStar(require("./controllers/dataOutput"));
const downloadDataController = __importStar(require("./controllers/downloadData"));
const registerController = __importStar(require("./controllers/register"));
const loginController = __importStar(require("./controllers/login"));
const passportConfig = __importStar(require("./controllers/passportConfig"));
// Create Express server
const app = express_1.default();
passportConfig_1.default(passport_1.default);
const sessionSecret = process.env.SESSION_SECRET;
// Express configuration
const public_path = path_1.default.join(__dirname, "../public");
console.log("Public path is " + public_path);
app.use(express_1.default.static(public_path));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use(express_session_1.default({
    secret: sessionSecret,
    saveUninitialized: false,
    resave: false,
    name: "Engineering4Music",
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(express_flash_1.default());
/*app.use((req: Request, res: Response, next: NextFunction) => {
    res.locals.sessionFlash = req.session?.sessionFlash;
    delete req.session?.sessionFlash;
    next();
});*/
app.all("/express-flash", (req, res) => {
    req.flash("success", "This is a flash message");
    res.redirect(301, "/");
});
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.err_msg = req.flash("err_msg");
    res.locals.not_registered_msg = req.flash("not_registered_msg");
    next();
});
app.set("port", process.env.PORT || 3000);
app.set("views", path_1.default.join(__dirname, "../views"));
app.engine("handlebars", express_handlebars_1.default());
app.set("view engine", "handlebars");
// Primary app routes.
app.post("/auth", registerController.register);
app.get("/loginForm", passportConfig.checkAuthenticated, loginController.loginForm);
app.get("/join", registerController.form);
// app.post("/login", loginController.postLogin);
// app.post("/login", passportConfig.initialize);
app.post("/login", passport_1.default.authenticate("local", {
    successRedirect: "/data",
    failureRedirect: "/loginform",
    failureFlash: true,
}));
app.get("/logout", passportConfig.logout);
app.get("/about", aboutController.index);
app.get("/", homeController.index);
app.get("/home", homeController.index);
app.get("/main", dataOutputController.main);
app.get("/data", passportConfig.checkNotAuthenticated, downloadDataController.loadData);
app.get("/dataJSONAll", downloadDataController.loadJSONAll);
app.get("/dataJSONlast24h", downloadDataController.loadJSONlast24h);
app.get("/dataJSONlast7d", downloadDataController.loadJSONlast7d);
app.get("/dataJSONlast1m", downloadDataController.loadJSONlast1m);
exports.default = app;
