import { Request, Response, NextFunction } from "express";

export const index = (req: Request, res: Response, next: NextFunction) => {
	res.render("home", {
		layout: false,
		title: "Home",
		login: req.isAuthenticated(),
	});
};
