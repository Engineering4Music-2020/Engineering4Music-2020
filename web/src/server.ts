import errorHandler from "errorhandler";
import app from "./app";

// ERROR HANDLER THAT OUTPUTS FULL STACKTRACES
// IS ACTIVE WHEN DEVELOPING

if (app.get("env") == "development") {
	app.use(errorHandler());
}

// START EXPRESS SERVER

const server = app.listen(app.get("port"), () => {
	console.log(
		"App is running at http://localhost:%d in %s mode",
		app.get("port"),
		app.get("env")
	);
	console.log("  Press CTRL-C to stop\n");
});

export default server;
