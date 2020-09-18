import { Request, Response, NextFunction } from "express";

/**
 * GET /
 * Home page.
 */
export const index = (req: Request, res: Response, next: NextFunction) => {
		res.render("home", {
			layout: false,
			title: "Home",
		});

	/*res.render("home", {
		layout: false,
		title: "Home",
		userData: req.user,
		messages: {
			danger: req.flash('danger'),
			warning: req.flash('warning'),
			success: req.flash('success')
		}
	});
	console.log(req.user);*/
}