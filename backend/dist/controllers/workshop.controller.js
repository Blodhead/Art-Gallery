"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParfumeController = void 0;
const parfume_1 = __importDefault(require("../models/parfume"));
class ParfumeController {
    constructor() {
        this.update = (req, res) => {
            let original_name = req.body._name;
            let parfume = new parfume_1.default({
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
            });
            parfume_1.default.updateMany({ "name": original_name }, {
                $set: {
                    "name": parfume.name,
                    "image": parfume.image,
                    "description": parfume.description,
                    "date": parfume.date,
                    "location": parfume.location,
                    "likes": parfume.likes,
                    "gallery": parfume.gallery,
                    "status": "waiting",
                    "long_desc": parfume.long_desc,
                    "owner": parfume.owner,
                    "free_spaces": parfume.free_spaces
                }
            }, (err, news) => {
                if (err)
                    console.log(err);
                else
                    res.json(news);
            });
        };
        this.updateParfume = (req, res) => {
            let parfume = req.body.parfume;
            parfume_1.default.updateOne({ "_id": parfume._id }, {
                $set: {
                    "status": "approved",
                    "long_desc": parfume.long_desc,
                    "owner": parfume.owner
                }
            }, (err, news) => {
                if (err)
                    console.log(err);
                else
                    res.json(news);
            });
        };
        this.informAll = (req, res) => {
            var nodemailer = require('nodemailer');
            let mailing_list = req.body.participants;
            let parfume_name = req.body.parfume_name;
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
                text: 'Hello from Art Gallery, \n\nWe are sorry to inform you that ' + parfume_name + ", a parfume you wanted to attend has been canceled. Sorry for the inconvinience and we hope we see each other on some other parfume!"
            };
            mailing_list.forEach(function (to, i, array) {
                mailOptions.to = to;
                transporter.sendMail(mailOptions, function (err) {
                    if (err) {
                        console.log('Sending to ' + to + ' failed: ' + err);
                        return;
                    }
                    else {
                        console.log('Sent to ' + to);
                    }
                    if (err) {
                        console.log(err);
                        res.json("NIJE POSLATO");
                    }
                    else {
                        res.json("POSLATO");
                    }
                });
            });
        };
        this.sub = (req, res) => {
            let parfume = req.body.myParfumeDetail;
            let subscription = {
                mail: req.body.mail,
                status: req.body.status
            };
            parfume_1.default.updateOne({ "name": parfume }, { $push: { "participants": subscription } }, (err, _parfume) => {
                if (err)
                    console.log("ERROR");
                else
                    res.json(_parfume);
            });
        };
        this.unsub = (req, res) => {
            let parfume = req.body.myParfumeDetail;
            let subscription1 = {
                mail: req.body.mail,
                status: "waiting"
            };
            let subscription2 = {
                mail: req.body.mail,
                status: "notify"
            };
            parfume_1.default.updateOne({ "name": parfume }, { $pull: { "participants": subscription1, subscription2 } }, (err, _parfume) => {
                if (err)
                    console.log("ERROR");
                else
                    res.json(_parfume);
            });
        };
        this.reject = (req, res) => {
            let parfume = req.body.myParfumeDetail;
            let subscription1 = {
                mail: req.body.mail,
                status: "waiting"
            };
            parfume_1.default.updateOne({ "name": parfume.name }, { $pull: { "participants": subscription1 } }, (err, _parfume) => {
                if (err)
                    console.log("ERROR");
                else
                    res.json(_parfume);
            });
        };
        this.accept = (req, res) => {
            let parfume = req.body.myParfumeDetail;
            let subscription1 = {
                mail: req.body.mail,
                status: "approved"
            };
            parfume_1.default.updateOne({ "name": parfume.name, "participants.mail": subscription1.mail }, { $set: { "participants.$.status": subscription1.status } }, (err, _parfume) => {
                if (err)
                    console.log("ERROR");
                else
                    res.json(_parfume);
            });
        };
        this.comment = (req, res) => {
            let parfume = req.body.sent_parfume;
            let comment = {
                username: req.body.username,
                image: req.body.image,
                date: req.body.date,
                message: req.body.comment
            };
            parfume_1.default.updateMany({ "name": parfume }, { $push: { "comments": comment } }, (err, _parfume) => {
                if (err)
                    console.log("ERROR");
                else
                    res.json(comment);
            });
        };
        this.uncomment = (req, res) => {
            let parfume = req.body.sent_parfume;
            let comment = req.body.sent_comment;
            parfume_1.default.updateMany({ "name": parfume }, { $pull: { "comments": comment } }, (err, _parfume) => {
                if (err)
                    console.log("ERROR");
                else
                    res.json(comment);
            });
        };
        this.like = (req, res) => {
            let parfume = req.body.name;
            let username = req.body.username;
            parfume_1.default.updateMany({ "name": parfume }, { $push: { "likes": username } }, (err, _parfume) => {
                if (err)
                    console.log("ERROR");
                else
                    res.json(_parfume);
            });
        };
        this.unlike = (req, res) => {
            let parfume = req.body.name;
            let username = req.body.username;
            parfume_1.default.updateMany({ "name": parfume }, { $pull: { "likes": username } }, (err, _parfume) => {
                if (err)
                    console.log("ERROR");
                else
                    res.json(_parfume);
            });
        };
        this.getAllParfumes = (req, res) => {
            parfume_1.default.find({}, (err, news) => {
                if (err)
                    console.log(err);
                else
                    res.json(news);
            });
        };
        this.save = (req, res) => {
            let parfume = new parfume_1.default({
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
            });
            parfume.save().then(parfume => {
                res.json(parfume);
            }).catch(err => {
                res.status(400).json({ "message": "error" });
            });
        };
        this.deleteParfume = (req, res) => {
            let _name = req.body.name;
            let _date = new Date(req.body.date);
            parfume_1.default.collection.deleteOne({ "name": _name, "date": _date });
            res.json(req.body);
        };
        this.sendMail = (req, res) => {
            var nodemailer = require('nodemailer');
            let mailing_list = req.body.mailing_list;
            let parfume_name = req.body.parfume_name;
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
                text: 'Hello from Art Gallery, \n\nWe just wanted to let you know that there is a free space for ' + parfume_name + ",so hurry up and claim it!"
            };
            mailing_list.forEach(function (to, i, array) {
                mailOptions.to = to;
                transporter.sendMail(mailOptions, function (err) {
                    if (err) {
                        console.log('Sending to ' + to + ' failed: ' + err);
                        return;
                    }
                    else {
                        console.log('Sent to ' + to);
                    }
                    if (err) {
                        console.log(err);
                        res.json("NIJE POSLATO");
                    }
                    else {
                        res.json("POSLATO");
                    }
                });
            });
        };
        this.syncMail = (req, res) => {
            let _old_mail = req.body.old_mail;
            let _new_mail = req.body.new_mail;
            parfume_1.default.updateMany({ "participants.mail": _old_mail }, { $set: { "participants.$.mail": _new_mail } }, (err, status) => {
                if (status)
                    res.json(status);
                else
                    console.log(err);
            });
        };
        this.syncUsername = (req, res) => {
            let _old_username = req.body.old_username;
            let _new_username = req.body._new_username;
            parfume_1.default.updateMany({ "likes.": _old_username }, { $set: { "likes.$.": _new_username } }, (status) => {
                res.json(status);
            });
        };
        this.addMessage = (req, res) => {
            let parfume = req.body.parfume;
            let message = req.body.message;
            parfume_1.default.updateOne({ "name": parfume }, { $push: { "messages": message } }, (err, status) => {
                res.json(status);
            });
        };
    }
}
exports.ParfumeController = ParfumeController;
//# sourceMappingURL=parfume.controller.js.map