"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const users_1 = __importDefault(require("../models/users"));
class UserController {
    constructor() {
        this.register = (req, res) => {
            let user = new users_1.default({
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
            });
            user.save().then(user => {
                res.status(200).json({ "message": "user added" });
            }).catch(err => {
                res.status(400).json({ "message": "error" });
            });
        };
        this.update = (req, res) => {
            let curr_sent = req.body.curr_sent;
            let user = new users_1.default({
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
            });
            users_1.default.updateOne({ "username": curr_sent }, {
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
                if (err)
                    console.log(err);
                else
                    res.json(user);
            });
        };
        this.login = (req, res) => {
            let username = req.body.username; //dohvata usernamer iz tela
            let password = req.body.password; //dohvata possword iz tela
            users_1.default.findOne({ "username": username }, (err, user) => {
                if (err)
                    console.log(err);
                else {
                    if (password == user.password) {
                        res.json(user);
                        return;
                    }
                    if (password == user.tempPass) {
                        if ((new Date()).getTime() - (user.timeStamp.getTime() + 1800000) >= 0) //30 minutes
                            user.status = "Reset password expired";
                        res.json(user);
                        return;
                    }
                }
            });
        };
        this.updateStatus = (req, res) => {
            let username = req.body.username;
            let status = req.body.status;
            users_1.default.collection.updateOne({ "username": username }, { $set: { "status": status } });
        };
        this.deleteUser = (req, res) => {
            let username = req.body.username;
            users_1.default.collection.deleteOne({ "username": username });
            res.json(req.body);
        };
        this.getTempData = (req, res) => {
            users_1.default.find({}, (err, data) => {
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
                    user: 'cirkovic32.mi@gmail.com',
                    pass: 'lriyeiguroelkawg'
                }
            });
            var mailOptions = {
                from: 'cirkovic32.mi@gmail.com',
                to: mail,
                subject: 'Password reset @no-reply',
                text: 'Hello from Art Gallery, \n\nYour reset password is: ' + temp_password + "\n\n P.S.IF YOU DIDN'T INITIATE PASSWORD RESET, IGNORE THIS E-MAIL!"
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    res.json("NIJE POSLATO");
                }
                else {
                    res.json("POSLATO");
                }
            });
            let data = {
                temp_password: temp_password,
                timeStamp: new Date()
            };
            console.log(temp_password);
            users_1.default.updateOne({ "mail": mail }, {
                $set: { "tempPass": data.temp_password, "timeStamp": data.timeStamp }
            }, (error, info) => {
                if (error) {
                    console.log(error);
                    res.json("NIJE POSLATO");
                }
                else {
                    res.json("POSLATO");
                }
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
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map