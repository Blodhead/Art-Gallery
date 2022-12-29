import * as express from "express";
import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
import User from "../models/users"

export class UserController {

    register = (req: express.Request, res: express.Response) => {
        let user = new User({
            profile_photo_name: req.body.profile_photo_name,
            org_name: req.body.org_name,
            firstname: req.body.firstname,
            phone: req.body.phone,
            mail: req.body.mail,
            lastname: req.body.lastname,
            username: req.body.username,
            password: req.body.password,
            type: req.body.type,
            state: req.body.state,
            city: req.body.city,
            postal_code: req.body.postal_code,
            street: req.body.street,
            number: req.body.number,
            pib: req.body.pib,

        })

        user.save().then(user => {
            res.status(200).json({ "message": "user added" });
        }).catch(err => {
            res.status(400).json({ "message": "error" })
        })
    }

    login = (req: express.Request, res: express.Response) => { //req se koristi za Requests, a povratna vrednost je res, tj. Response
        let username = req.body.username; //dohvata usernamer iz tela
        let password = req.body.password; //dohvata possword iz tela

        User.findOne({ "username": username, "password": password }, (err, user) => {//findOne vraca jednu instancu sa parametrima username i password
            if (err) console.log(err);                                         //izvrsava Querry i vraca instancu na takav nacin da je prvo error
            else res.json(user)                                               //a zatim trazeni korisnik. Ako korisnik ne postoji, err ce imati vrednost error poruke
        })                                                                    //"login" dobija vrednost korisnika koji se vraca iz lambda izraza
    }

    getTempData = (req: express.Request, res: express.Response) => {
        User.find({}, (err, data) => {
            
            if (err) console.log(err);
            else {res.json(data); return data;}
        }
        )
    }
}