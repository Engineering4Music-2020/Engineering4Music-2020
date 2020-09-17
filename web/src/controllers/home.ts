import { Request, Response, NextFunction } from "express";

export const index = (req: Request, res: Response, next: NextFunction) => {
	if(req.session !== undefined) {
		res.render("home", {
			layout: false,
			title: "Home",
			userData: req.user,
		});
	} else {
		res.redirect("/loginForm");
	}

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
};
