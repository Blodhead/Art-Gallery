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
            users_1.default.findOne({ "username": username, "password": password }, (err, user) => {
                if (err)
                    console.log(err); //izvrsava Querry i vraca instancu na takav nacin da je prvo error
                else
                    res.json(user); //a zatim trazeni korisnik. Ako korisnik ne postoji, err ce imati vrednost error poruke
            }); //"login" dobija vrednost korisnika koji se vraca iz lambda izraza
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
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'cirkovic32.mi@gmail.com',
                    pass: 'lriyeiguroelkawg'
                }
            });
            var mailOptions = {
                from: 'cirkovic32.mi@gmail.com',
                to: 'cirkovic32.mi@gmail.com',
                subject: 'Sending Email using Node.js',
                text: 'That was easy!'
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    res.json("NIJE POSLATO");
                }
                else {
                    console.log('Email sent: ' + info.response);
                    res.json("POSLATO");
                }
            });
        };
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map