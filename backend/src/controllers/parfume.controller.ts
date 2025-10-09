import * as express from "express";
import { Request, Response } from "express-serve-static-core";
import { appendFile } from "fs";
import { ParsedQs } from "qs";
import Parfume from "../models/parfumes"

export class ParfumeController {

    register = (req: express.Request, res: express.Response) => {
        let parfume = new Parfume({
            profile_photo_name: req.body.profile_photo_name,
            org_name: req.body.org_name,
            firstname: req.body.firstname,
            phone: req.body.phone,
            mail: req.body.mail,
            lastname: req.body.lastname,
            parfumename: req.body.parfumename,
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

        parfume.save().then(parfume => {
            res.status(200).json({ "message": "parfume added" });
        }).catch(err => {
            res.status(400).json({ "message": "error" })
        })
    }

    update = (req: express.Request, res: express.Response) => {
        let curr_sent = req.body.curr_sent;
        let parfume = new Parfume({
            profile_photo_name: req.body.profile_photo_name,
            org_name: req.body.org_name,
            firstname: req.body.firstname,
            phone: req.body.phone,
            mail: req.body.mail,
            lastname: req.body.lastname,
            parfumename: req.body.parfumename,
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

        Parfume.updateOne({ "parfumename": curr_sent },
            {
                $set: {
                    "name": parfume.name,
                    "amount": parfume.amount,
                    "price": parfume.price,
                    "img_location": parfume.img_location
                }
            }, (err, parfumes) => {
                if (err) console.log(err);
                else res.json(parfume);
            });

    }

    login = (req: express.Request, res: express.Response) => { //req se koristi za Requests, a povratna vrednost je res, tj. Response
        let parfumename = req.body.parfumename; //dohvata parfumenamer iz tela
        let password = req.body.password; //dohvata possword iz tela

        
        Parfume.findOne({ "parfumename": parfumename, "password": password }, (err, parfume) => {

            if (parfume == null) {

                Parfume.findOne({ "parfumename": parfumename, "tempPass": password }, (err, parfume) => {
                    if(parfume==null) res.json(null);
                    else res.json(parfume);
                });

            }
            else {
                if (password == parfume.password) { res.json(parfume); return; }
                if (password == parfume.tempPass) {
                    if ((new Date()).getTime() - (parfume.timeStamp.getTime() + 1800000) >= 0) //30 minutes
                        parfume.status = "Reset password expired";
                    res.json(parfume); return;
                }

            }
        })
    }

    updateStatus = (req: express.Request, res: express.Response) => {

        let parfumename = req.body.parfumename;
        let status = req.body.status;
        Parfume.collection.updateOne({ "parfumename": parfumename }, { $set: { "status": status } });

    }

    deleteParfume = (req: express.Request, res: express.Response) => {
        let parfumename = req.body.parfumename;
        Parfume.collection.deleteOne({ "parfumename": parfumename });
        res.json(req.body);
    }

    getTempData = (req: express.Request, res: express.Response) => {
        Parfume.find({}, (err, data) => {

            if (err) console.log(err);
            else { res.json(data); return data; }
        }
        )
    }

    getAllParfumes = (req: express.Request, res: express.Response) => {
        Parfume.find({}, (err, data) => {

            if (err) console.log(err);
            else {res.json(data); return data; }
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
                parfume: 'cirkovic32.mi@gmail.com',
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
        Parfume.updateOne({ "mail": mail }, {
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

    updatePassword = (req: express.Request, res: express.Response) => {
        Parfume.collection.updateOne({ "parfumename": req.body.parfumename }, { $set: { "password": req.body.new_pass, "tempPass": null, "timeStamp": null } }, () => {
            res.json("updated");
        });
    }
}