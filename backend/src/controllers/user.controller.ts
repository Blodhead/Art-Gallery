import * as express from "express";
import { Request, Response } from "express-serve-static-core";
import { appendFile } from "fs";
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

        User.updateOne({ "username": curr_sent },
            {
                $set: {
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
                }
            }, (err, users) => {
                if (err) console.log(err);
                else res.json(user);
            });

    }

    login = (req: express.Request, res: express.Response) => { //req se koristi za Requests, a povratna vrednost je res, tj. Response
        let username = req.body.username; //dohvata usernamer iz tela
        let password = req.body.password; //dohvata possword iz tela

        User.findOne({ "username": username }, (err, user) => {
            if (err) console.log(err);
            else {
                if (password == user.password) { res.json(user); return; }
                if (password == user.tempPass) {
                    if ((new Date()).getTime() - (user.timeStamp.getTime() + 1800000) >= 0) //30 minutes
                        user.status = "Reset password expired";
                    res.json(user); return;
                }

            }
        })
    }

    updateStatus = (req: express.Request, res: express.Response) => {

        let username = req.body.username;
        let status = req.body.status;
        User.collection.updateOne({ "username": username }, { $set: { "status": status } });

    }

    deleteUser = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        User.collection.deleteOne({ "username": username });
        res.json(req.body);
    }

    getTempData = (req: express.Request, res: express.Response) => {
        User.find({}, (err, data) => {

            if (err) console.log(err);
            else { res.json(data); return data; }
        }
        )
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
    }

    shuffle(str: String) {
        var a = (str.toString()).split(""),
            n = a.length;
        //console.log(a);
        for (var i = n - 1; i > 0; i--) {
            var j = this.getRandomInt(0, n);
            var tmp = a[i];
            a[i] = a[j];

            a[j] = tmp;
        }
        //console.log(a);
        return a.join("");
    }

    sendMail = (req: express.Request, res: express.Response) => {
        var nodemailer = require('nodemailer');
        var randomWords = require('random-words');
        var special = "!\"§$%&/()=?\u{20ac}";

        let mail = req.body.mail;

        let temp_password = randomWords({ exactly: 1, maxLength: 8 });

        while (temp_password[0].length < 6 || temp_password[0].length > 8)
            temp_password = randomWords({ exactly: 1, maxLength: 8 });

        let ceil = this.getRandomInt(3, 4);
        temp_password = this.shuffle(temp_password);
        var a = (temp_password.toString()).split("");

        for (let i = temp_password.length - 1; i > temp_password.length - ceil - 1; i--) {
            a[i] = this.getRandomInt(0, 9) + "";
        }

        temp_password = a;
        let suff_numb = 0;

        if (temp_password.length - ceil > ceil) {
            suff_numb = this.getRandomInt(ceil, temp_password.length - ceil);
        } else {
            suff_numb = this.getRandomInt(temp_password.length - ceil, ceil);
        }

        for (let j = 0; j < suff_numb; j++) {
            temp_password[j] = temp_password[j].toUpperCase();
        }
        let spec_char1 = this.getRandomInt(1, (special.length - 1));
        let spec_char2 = this.getRandomInt(1, (special.length - 1));

        temp_password[0] = special[spec_char1];
        temp_password[temp_password.length - 1] = special[spec_char2];

        temp_password = temp_password.join("");
        temp_password = this.shuffle(temp_password);
        const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~1234567890]/;
        while (specialChars.test(temp_password[0])) {
            temp_password = this.shuffle(temp_password);
        }
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'cirkovic32.mi@gmail.com',
                pass: 'lriyeiguroelkawg'
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        var mailOptions = {
            from: 'cirkovic32.mi@gmail.com',
            to: mail,
            subject: 'Password reset @no-reply',
            text: 'Hello from Art Gallery, \n\nYour reset password is: ' + temp_password + "\n\n P.S.IF YOU DIDN'T INITIATE PASSWORD RESET, IGNORE THIS E-MAIL!"
        };

        let statement: boolean = false;

        transporter.sendMail(mailOptions, (error, info) => {
            if (statement == false)
                if (error) {
                    console.log(error);
                    res.json("NIJE POSLATO");
                } else {
                    res.json("POSLATO");
                }
            statement = true;
        });
        let data = {
            temp_password: temp_password,
            timeStamp: new Date()
        }
        console.log(temp_password);
        User.updateOne({ "mail": mail }, {
            $set: { "tempPass": data.temp_password, "timeStamp": data.timeStamp }
        }, (error, info) => {
            if (statement == true)
                if (error) {
                    if (statement == true)
                        console.log(error);
                    res.json("NIJE POSLATO");
                } else {
                    res.json("POSLATO");

                }
            statement = false;
        });
    }
}