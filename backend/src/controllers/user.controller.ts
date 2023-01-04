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
            status: req.body.status

        })

        user.save().then(user => {
            res.status(200).json({ "message": "user added" });
        }).catch(err => {
            res.status(400).json({ "message": "error" })
        })
    }

    update = (req: express.Request, res: express.Response) => {
        let curr_sent = req.body.curr_sent;
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
            status: req.body.status

        })

        User.updateOne({ "username": curr_sent},
            {$set:{
                "profile_photo_name": user.profile_photo_name,
                "org_name": user.org_name,
                "firstname": user.firstname,
                "phone": user.phone,
                "mail": user.mail,
                "lastname": user.lastname,
                "username": user.username,
                "password": user.password,
                "type": user.type,
                "state": user.state,
                "city": user.city,
                "postal_code": user.postal_code,
                "street": user.street,
                "number": user.number,
                "pib": user.pib,
                "status": user.status
            }},(err, users)=>{
                if (err) console.log(err);
            else res.json(user);
            });

    }

    login = (req: express.Request, res: express.Response) => { //req se koristi za Requests, a povratna vrednost je res, tj. Response
        let username = req.body.username; //dohvata usernamer iz tela
        let password = req.body.password; //dohvata possword iz tela

        User.findOne({ "username": username, "password": password }, (err, user) => {//findOne vraca jednu instancu sa parametrima username i password
            if (err) console.log(err);                                         //izvrsava Querry i vraca instancu na takav nacin da je prvo error
            else res.json(user);                                             //a zatim trazeni korisnik. Ako korisnik ne postoji, err ce imati vrednost error poruke
        })                                                                    //"login" dobija vrednost korisnika koji se vraca iz lambda izraza
    }

    updateStatus = (req: express.Request, res: express.Response)=>{

        let username = req.body.username;
        let status = req.body.status;
        User.collection.updateOne({"username":username}, {$set: {"status":status}});

    }

    deleteUser = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        User.collection.deleteOne({"username":username});
        res.json(req.body);
    }

    getTempData = (req: express.Request, res: express.Response) => {
        User.find({}, (err, data) => {
            
            if (err) console.log(err);
            else {res.json(data); return data;}
        }
        )
    }
}