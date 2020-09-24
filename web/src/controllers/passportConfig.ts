import passportLocal from "passport-local";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { pool } from "../../../database/src/pool";

dotenv.config();

const LocalStrategy = passportLocal.Strategy;

export const initialize = async (passport: any) => {
	passport.use(
		new LocalStrategy(
			{
				usernameField: "email",
				passwordField: "password",
				passReqToCallback: true
			},
			(req, email, password, done) => {
				pool.query(
					`SELECT * FROM login WHERE email LIKE '${email}';`,
					(err, result) => {
						if (err) {
							throw err;
						}
						if (result.rowCount > 0) {
							const user = result.rows[0];
							global.id = user.id;
							bcrypt.compare(password, user.password, (err, isMatch) => {
								if (err) {
									throw err;
								}
								if (isMatch) {
									return done(null, user);
								} else {
									return done(null, false, req.flash("err_msg", "Wrong Password!"));
								}
							});
						} else {
							return done(null, false, req.flash("not_registered_msg", "Click here to register."));
						}
					}
				);
			}
		)
	);
	passport.serializeUser((user: any, done: any) => {
		done(null, user.id, user.name);
	});
	passport.deserializeUser((id: any, done: any) => {
		pool.query(`SELECT * FROM login WHERE id = ${id};`, (err, result) => {
			if (err) {
				throw err;
			}
			return done(null, result.rows[0]);
		});
	});

};

export const checkAuthenticated = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (req.isAuthenticated()) {
		return res.redirect("data" + { user: req.user } + { id });
	}
	next();
};

export const checkNotAuthenticated = (req: Request, res: Response, next: NextFunction) => {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/loginForm");
};

export const logout = (req: Request, res: Response) => {
	req.logout();
	res.redirect("/");
	req.flash("success_msg", "You have logged out successfully.");
};

const message = (req: Request, res: Response) => {
	res.render("loginForm", {
		layout: false,
		expressFlash: req.flash("success"), sessionFlash: res.locals.sessionFlash
	});
};

export default initialize;
