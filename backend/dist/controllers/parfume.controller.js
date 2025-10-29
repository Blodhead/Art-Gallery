"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParfumeController = void 0;
const parfumes_1 = __importDefault(require("../models/parfumes"));
class ParfumeController {
    constructor() {
        this.register = (req, res) => {
            let parfume = new parfumes_1.default({
                profile_photo_name: req.body.profile_photo_name,
                org_name: req.body.org_name,
                firstname: req.body.firstname,
                phone: req.body.phone,
                email: req.body.email,
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
            });
            parfume.save().then(parfume => {
                res.status(200).json({ "message": "parfume added" });
            }).catch(err => {
                res.status(400).json({ "message": "error" });
            });
        };
        this.update = (req, res) => {
            let curr_sent = req.body.curr_sent;
            let parfume = new parfumes_1.default({
                profile_photo_name: req.body.profile_photo_name,
                org_name: req.body.org_name,
                firstname: req.body.firstname,
                phone: req.body.phone,
                email: req.body.email,
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
            });
            parfumes_1.default.updateOne({ "parfumename": curr_sent }, {
                $set: {
                    "name": parfume.name,
                    "amount": parfume.amount,
                    "price": parfume.price,
                    "img_location": parfume.img_location
                }
            }, (err, parfumes) => {
                if (err)
                    console.log(err);
                else
                    res.json(parfume);
            });
        };
        this.login = (req, res) => {
            let parfumename = req.body.parfumename; //dohvata parfumenamer iz tela
            let password = req.body.password; //dohvata possword iz tela
            parfumes_1.default.findOne({ "parfumename": parfumename, "password": password }, (err, parfume) => {
                if (parfume == null) {
                    parfumes_1.default.findOne({ "parfumename": parfumename, "tempPass": password }, (err, parfume) => {
                        if (parfume == null)
                            res.json(null);
                        else
                            res.json(parfume);
                    });
                }
                else {
                    if (password == parfume.password) {
                        res.json(parfume);
                        return;
                    }
                    if (password == parfume.tempPass) {
                        if ((new Date()).getTime() - (parfume.timeStamp.getTime() + 1800000) >= 0) //30 minutes
                            parfume.status = "Reset password expired";
                        res.json(parfume);
                        return;
                    }
                }
            });
        };
        this.updateStatus = (req, res) => {
            let parfumename = req.body.parfumename;
            let status = req.body.status;
            parfumes_1.default.collection.updateOne({ "parfumename": parfumename }, { $set: { "status": status } });
        };
        this.deleteParfume = (req, res) => {
            let parfumename = req.body.parfumename;
            parfumes_1.default.collection.deleteOne({ "parfumename": parfumename });
            res.json(req.body);
        };
        this.getTempData = (req, res) => {
            parfumes_1.default.find({}, (err, data) => {
                if (err)
                    console.log(err);
                else {
                    res.json(data);
                    return data;
                }
            });
        };
        this.getAllParfumes = (req, res) => {
            parfumes_1.default.find({}, (err, data) => {
                if (err)
                    console.log(err);
                else {
                    res.json(data);
                    return data;
                }
            });
        };
        this.sendMail = (req, res) => {
            var nodemailer = require('nodemailer');
            var randomWords = require('random-words');
            var special = "!\"§$%&/()=?\u{20ac}";
            let email = req.body.email;
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
            }
            else {
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
                to: email,
                subject: 'Password reset @no-reply',
                text: 'Hello from Art Gallery, \n\nYour reset password is: ' + temp_password + "\n\n P.S.IF YOU DIDN'T INITIATE PASSWORD RESET, IGNORE THIS E-MAIL!"
            };
            let statement = false;
            transporter.sendMail(mailOptions, (error, info) => {
                if (statement == false)
                    if (error) {
                        console.log(error);
                        res.json("NIJE POSLATO");
                    }
                    else {
                        res.json("POSLATO");
                    }
                statement = true;
            });
            let data = {
                temp_password: temp_password,
                timeStamp: new Date()
            };
            console.log(temp_password);
            parfumes_1.default.updateOne({ "email": email }, {
                $set: { "tempPass": data.temp_password, "timeStamp": data.timeStamp }
            }, (error, info) => {
                if (statement == true)
                    if (error) {
                        if (statement == true)
                            console.log(error);
                        res.json("NIJE POSLATO");
                    }
                    else {
                        res.json("POSLATO");
                    }
                statement = false;
            });
        };
        this.updatePassword = (req, res) => {
            parfumes_1.default.collection.updateOne({ "parfumename": req.body.parfumename }, { $set: { "password": req.body.new_pass, "tempPass": null, "timeStamp": null } }, () => {
                res.json("updated");
            });
        };
    }
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
    }
    shuffle(str) {
        var a = (str.toString()).split(""), n = a.length;
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
}
exports.ParfumeController = ParfumeController;
//# sourceMappingURL=parfume.controller.js.map