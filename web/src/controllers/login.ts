import express, { Request, Response, NextFunction } from "express";
import { Client } from "pg";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import * as passportLocal from "passport-local";
const app = express();
const LocalStrategy = passportLocal.Strategy;
/*
passport.serializeUser<any, any>((user, done) => {
    done(undefined, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    })
})
*/
export const loginForm = (req: Request, res: Response, next: NextFunction) => {
	res.render("login", {
		layout: false,
		title: "Login",
		loginActive: true,
		loginFailed: req.body.loginFailed,
	});
	console.log(req.body);
};
/*res.render("login", {
        layout: false,
        title: "Login Form"
    });*/

/*export const login = (req: Request, res: Response) => {
    const lookUpCredentials = async () =>{
        app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    const username = req.body.email;
    const password = req.body.password;
            
            
        const client = new Client({
            connectionString: process.env.DB_URI,
            ssl: {
                rejectUnauthorized: false
            }
        });
        try {
            console.log(username, password);
            await client.connect();
            console.log(`Connected`);
            const data:any = await client.query(`SELECT * FROM login WHERE email LIKE '${username}';`)
            for(let row of data.rows) {
                let loadedEmail = row.email; 
                let hash = row.password;
                let id = row.id;
                let name = row.name;
                
                console.log(loadedEmail, hash, id, name);

                if(data.rows === null) {
                    res.redirect("/join");
                }

                bcrypt.compare(password, hash).then((result) => {
                    if(result === true) {
                        if(req.session !== undefined) {
                            req.session.isLoggedIn = true;
                            req.session.user = id;
                        }
                        res.redirect("/");
                    } else {
                        req.body.loginFailed = true;
                        res.redirect("/loginForm");
                    }
                }).catch((error) => {
                    console.log(error);
                });           
            }
        } catch(error) {
            console.log(error);
        } finally {
            client.end();
            res.redirect("/")
        }
    }    
    lookUpCredentials();
}

export const logout = (req: Request, res: Response) => {
    if(req.session !== undefined) {
        delete req.session.isLoggedIn;
    }
    res.redirect("/loginForm");
}        

*/
