import * as express from "express";
import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { brotliDecompressSync } from "zlib";
import Workshops from "../models/workshop"


export class WorkshopController {

    update = (req: express.Request, res: express.Response) => {

        let original_name = req.body._name;

        let workshop = new Workshops({
            name: req.body.name,
            image: req.body.image,
            description: req.body.description,
            date: req.body.date,
            location: req.body.location,
            likes: req.body.likes,
            gallery: req.body.gallery,
            long_desc: req.body.long_desc,
            owner: req.body.owner,
            free_spaces: req.body.free_spaces
        })

        Workshops.updateMany({ "name": original_name },
            {
                $set: {
                    "name": workshop.name,
                    "image": workshop.image,
                    "description": workshop.description,
                    "date": workshop.date,
                    "location": workshop.location,
                    "likes": workshop.likes,
                    "gallery": workshop.gallery,
                    "status": "waiting",
                    "long_desc": workshop.long_desc,
                    "owner": workshop.owner,
                    "free_spaces": workshop.free_spaces
                }
            }, (err, news) => {
                if (err) console.log(err);
                else res.json(news);
            });

    }

    updateWorkshop = (req: express.Request, res: express.Response) => {
        let workshop = req.body.workshop;
        Workshops.updateOne({ "_id": workshop._id }, {
            $set: {
                "status": "approved",
                "long_desc": workshop.long_desc,
                "owner": workshop.owner
            }
        }, (err, news) => {
            if (err) console.log(err);
            else res.json(news);
        });
    }

    informAll = (req: express.Request, res: express.Response) => {

        var nodemailer = require('nodemailer');

        let mailing_list = req.body.participants;
        let workshop_name = req.body.workshop_name;

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
            to: mailing_list,
            subject: '@NotifyMe @no-reply',
            text: 'Hello from Art Gallery, \n\nWe are sorry to inform you that ' + workshop_name + ", a workshop you wanted to attend has been canceled. Sorry for the inconvinience and we hope we see each other on some other workshop!"
        };

        mailing_list.forEach(function (to, i, array) {
            mailOptions.to = to;

            transporter.sendMail(mailOptions, function (err) {
                if (err) {
                    console.log('Sending to ' + to + ' failed: ' + err);
                    return;
                } else {
                    console.log('Sent to ' + to);
                }
                if (err) {
                    console.log(err);
                    res.json("NIJE POSLATO");
                } else {
                    res.json("POSLATO");
                }

            });
        });
    }


    sub = (req: express.Request, res: express.Response) => {

        let workshop = req.body.myWorkshopDetail;
        let subscription = {
            mail: req.body.mail,
            status: req.body.status
        }
        Workshops.updateOne({ "name": workshop }, { $push: { "participants": subscription } }, (err, _workshop) => {
            if (err) console.log("ERROR");
            else res.json(_workshop);
        });
    }

    unsub = (req: express.Request, res: express.Response) => {

        let workshop = req.body.myWorkshopDetail;
        let subscription1 = {
            mail: req.body.mail,
            status: "waiting"
        }
        let subscription2 = {
            mail: req.body.mail,
            status: "notify"
        }
        Workshops.updateOne({ "name": workshop }, { $pull: { "participants": subscription1, subscription2 } }, (err, _workshop) => {
            if (err) console.log("ERROR");
            else res.json(_workshop);
        });
    }

    reject = (req: express.Request, res: express.Response) => {

        let workshop = req.body.myWorkshopDetail;
        let subscription1 = {
            mail: req.body.mail,
            status: "waiting"
        }

        Workshops.updateOne({ "name": workshop.name }, { $pull: { "participants": subscription1 } }, (err, _workshop) => {
            if (err) console.log("ERROR");
            else res.json(_workshop);
        });
    }

    accept = (req: express.Request, res: express.Response) => {

        let workshop = req.body.myWorkshopDetail;
        let subscription1 = {
            mail: req.body.mail,
            status: "approved"
        }

        Workshops.updateOne({ "name": workshop.name, "participants.mail": subscription1.mail }, { $set: { "participants.$.status": subscription1.status } }, (err, _workshop) => {
            if (err) console.log("ERROR");
            else res.json(_workshop);
        });
    }

    comment = (req: express.Request, res: express.Response) => {

        let workshop = req.body.sent_workshop;
        let comment = {
            username: req.body.username,
            image: req.body.image,
            date: req.body.date,
            message: req.body.comment
        }
        Workshops.updateMany({ "name": workshop }, { $push: { "comments": comment } }, (err, _workshop) => {
            if (err) console.log("ERROR");
            else res.json(comment);
        });
    }

    uncomment = (req: express.Request, res: express.Response) => {

        let workshop = req.body.sent_workshop;
        let comment = req.body.sent_comment;
        Workshops.updateMany({ "name": workshop }, { $pull: { "comments": comment } }, (err, _workshop) => {
            if (err) console.log("ERROR");
            else res.json(comment);
        });
    }

    like = (req: express.Request, res: express.Response) => {
        let workshop = req.body.name;
        let username = req.body.username;
        Workshops.updateMany({ "name": workshop }, { $push: { "likes": username } }, (err, _workshop) => {
            if (err) console.log("ERROR");
            else res.json(_workshop);
        });
    }

    unlike = (req: express.Request, res: express.Response) => {
        let workshop = req.body.name;
        let username = req.body.username;
        Workshops.updateMany({ "name": workshop }, { $pull: { "likes": username } }, (err, _workshop) => {
            if (err) console.log("ERROR");
            else res.json(_workshop);
        });
    }


    getAllWorkshops = (req: express.Request, res: express.Response) => {
        Workshops.find({}, (err, news) => {
            if (err) console.log(err);
            else res.json(news);
        }
        )
    }

    save = (req: express.Request, res: express.Response) => {
        let workshop = new Workshops({
            name: req.body.name,
            image: req.body.image,
            description: req.body.description,
            date: req.body.date,
            likes: req.body.likes,
            location: req.body.location,
            gallery: req.body.gallery,
            free_spaces: req.body.free_spaces,
            status: req.body.status,
            owner: req.body.owner,
            long_desc: req.body.long_desc
        })
        workshop.save().then(workshop => {
            res.json(workshop);
        }).catch(err => {
            res.status(400).json({ "message": "error" })
        })
    }


    deleteWorkshop = (req: express.Request, res: express.Response) => {
        let _name = req.body.name;
        let _date = new Date(req.body.date);
        Workshops.collection.deleteOne({ "name": _name, "date": _date });
        res.json(req.body);
    }

    sendMail = (req: express.Request, res: express.Response) => {
        var nodemailer = require('nodemailer');

        let mailing_list = req.body.mailing_list;
        let workshop_name = req.body.workshop_name;

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
            to: mailing_list,
            subject: '@NotifyMe @no-reply',
            text: 'Hello from Art Gallery, \n\nWe just wanted to let you know that there is a free space for ' + workshop_name + ",so hurry up and claim it!"
        };

        mailing_list.forEach(function (to, i, array) {
            mailOptions.to = to;

            transporter.sendMail(mailOptions, function (err) {
                if (err) {
                    console.log('Sending to ' + to + ' failed: ' + err);
                    return;
                } else {
                    console.log('Sent to ' + to);
                }
                if (err) {
                    console.log(err);
                    res.json("NIJE POSLATO");
                } else {
                    res.json("POSLATO");
                }

            });
        });
    }

    syncMail = (req: express.Request, res: express.Response) => {
        let _old_mail = req.body.old_mail;
        let _new_mail = req.body.new_mail;

        Workshops.updateMany({ "participants.mail": _old_mail }, { $set: { "participants.$.mail": _new_mail } }, (err, status) => {
            if (status) res.json(status);
            else console.log(err);
        });
    }

    syncUsername = (req: express.Request, res: express.Response) => {
        let _old_username = req.body.old_username;
        let _new_username = req.body._new_username;

        Workshops.updateMany({ "likes.": _old_username }, { $set: { "likes.$.": _new_username } }, (status) => {
            res.json(status);
        });
    }

    addMessage = (req: express.Request, res: express.Response) => {
        let workshop = req.body.workshop;
        let message = req.body.message;
        Workshops.updateOne({ "name": workshop }, { $push: { "messages": message } }, (err,status) => {
            res.json(status);
        });
    }
}