"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const users_1 = __importDefault(require("../models/users"));
const bcrypt = __importStar(require("bcryptjs"));
const tokens_1 = __importDefault(require("../models/tokens"));
class UserController {
    constructor() {
        this.register = (req, res) => {
            const email = req.body.email;
            const username = req.body.username;
            const password = req.body.password;
            // basic presence check
            if (!email || !username || !password) {
                res.status(400).json({ message: 'missing fields' });
                return;
            }
            // hash the password before saving
            bcrypt.hash(password, 10).then((hash) => {
                let user = new users_1.default({
                    email: email,
                    username: username,
                    password: hash,
                });
                user.save().then(user => {
                    res.status(200).json({ "message": "user added" });
                }).catch(err => {
                    console.error(err);
                    res.status(400).json({ "message": "error" });
                });
            }).catch(err => {
                console.error(err);
                res.status(500).json({ message: 'hash error' });
            });
        };
        // POST { email }
        this.checkMail = (req, res) => {
            // accept either { mail } or { email } from clients
            const mail = req.body.mail || req.body.email;
            if (!mail) {
                // missing payload - client should send an e-mail to check
                res.status(400).json({ exists: false });
                return;
            }
            // Look up user by email and return a clear exists boolean
            users_1.default.findOne({ email: mail }, (err, user) => {
                if (err) {
                    console.error('checkMail error', err);
                    res.status(500).json({ exists: false });
                    return;
                }
                res.status(200).json({ exists: !!user });
            });
        };
        this.addShippingInfo = (req, res) => {
            let user = new users_1.default({
                phone: req.body.phone,
                email: req.body.email,
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
                email: req.body.email,
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
                    "email": user.email,
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
            users_1.default.findOne({ username: username }, (err, user) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    console.error(err);
                    res.json(null);
                    return;
                }
                if (!user) {
                    res.json(null);
                    return;
                }
                // check tempPass first (reset flow)
                if (user.tempPass && password == user.tempPass) {
                    if ((new Date()).getTime() - (user.timeStamp.getTime() + 1800000) >= 0) //30 minutes
                        user.status = "Reset password expired";
                    res.json(user);
                    return;
                }
                // compare hashed password
                const match = yield bcrypt.compare(password, user.password);
                if (!match) {
                    res.json(null);
                    return;
                }
                // generate token and save
                const token = this.generateToken(username);
                const tokenDoc = new tokens_1.default({ username: username, token: token });
                tokenDoc.save().catch(e => console.error('token save error', e));
                // Return user + token
                const userObj = user.toObject();
                userObj.token = token;
                res.json(userObj);
            }));
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
        this.logout = (req, res) => {
            const username = req.body.username;
            const token = req.body.token;
            if (!username || !token) {
                res.status(400).json({ message: 'missing' });
                return;
            }
            tokens_1.default.deleteOne({ username: username, token: token }, (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ message: 'error' });
                    return;
                }
                res.json({ message: 'logged out' });
            });
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
                    user: 'cirkovic32.mi@gmail.com',
                    pass: 'lriyeiguroelkawg'
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            var emailOptions = {
                from: 'cirkovic32.mi@gmail.com',
                to: email,
                subject: 'Password reset @no-reply',
                text: 'Hello from Art Gallery, \n\nYour reset password is: ' + temp_password + "\n\n P.S.IF YOU DIDN'T INITIATE PASSWORD RESET, IGNORE THIS E-MAIL!"
            };
            let statement = false;
            transporter.sendMail(emailOptions, (error, info) => {
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
            users_1.default.updateOne({ "email": email }, {
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
        // Send order confirmation email. Expects { email, shipping, cart }
        this.order = (req, res) => {
            const nodemailer = require('nodemailer');
            const email = req.body.email;
            const shipping = req.body.shipping || {};
            const cart = req.body.cart || {};
            if (!email) {
                res.status(400).json({ message: 'missing email' });
                return;
            }
            // Build HTML order summary
            let itemsRows = '';
            let total = 0;
            try {
                Object.keys(cart).forEach(k => {
                    const entry = cart[k];
                    const qty = entry.qty || 0;
                    const name = (entry.item && entry.item.name) || k;
                    const price = (entry.item && entry.item.price) ? entry.item.price : 0;
                    total += price * qty;
                    itemsRows += `
        <tr>
          <td style="padding: 8px 10px;">${name}</td>
          <td style="padding: 8px 10px; text-align: center;">${qty}</td>
          <td style="padding: 8px 10px; text-align: right;">${price.toFixed(2)} €</td>
        </tr>`;
                });
            }
            catch (e) {
                itemsRows = '<tr><td colspan="3">No items</td></tr>';
            }
            const shippingHTML = `
            <p style="margin: 0; line-height: 1.6;">
            <strong>Ime i Prezime:</strong> ${shipping.firstName || ''} ${shipping.lastName || ''}<br>
            <strong>Kontak telefon:</strong> ${shipping.phone || ''}<br>
            <strong>Adresa:</strong> ${shipping.street || ''} ${shipping.number || ''} ${shipping.houseNumber ? '/' + shipping.houseNumber : ''}<br>
            <strong>Grad:</strong> ${shipping.city || ''}<br>
            <strong>Poštanski broj:</strong> ${shipping.postalCode || ''}
            </p>`;
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'cirkovic32.mi@gmail.com',
                    pass: 'lriyeiguroelkawg' // app password
                },
                tls: { rejectUnauthorized: false }
            });
            const htmlBody = `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 650px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
            
            <!-- Header -->
            <div style="background-color: #f9f9f9; padding: 20px; text-align: center;">
                <span style="
                font-family: 'Montserrat', sans-serif;
                font-size: 2rem;
                font-weight: 600;
                color: #222;
                letter-spacing: 0.05em;
                text-decoration: none;
                ">FinestMiris</span>
            </div>

            <!-- Body -->
            <div style="padding: 20px;">
                <h2 style="color: #136207; text-align: center;">Hvala na ukazanom poverenju!</h2>
                <p style="text-align: center; margin-bottom: 25px;">Primili smo porudžbinu, uskoro ćemo pripremiti Vašu pošiljku!</p>

                <h3 style="border-bottom: 1px solid #ddd; padding-bottom: 4px;">Sažetak</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
                <thead>
                    <tr style="background: #f5f5f5;">
                    <th style="padding: 8px 10px; text-align: left;">Artikal</th>
                    <th style="padding: 8px 10px; text-align: center;">Količina</th>
                    <th style="padding: 8px 10px; text-align: right;">Cena (€)</th>
                    </tr>
                </thead>
                <tbody>${itemsRows}</tbody>
                </table>

                <div style="text-align: right; font-size: 1.1rem; font-weight: bold; margin-bottom: 20px;">
                Ukupno: ${total.toFixed(2)} €
                </div>

                <h3 style="border-bottom: 1px solid #ddd; padding-bottom: 4px;">Podaci za isporuku</h3>
                ${shippingHTML}

                <p style="margin-top: 30px; text-align: center; color: #777;">
                Srdačan pozdrav,<br>
                <strong>FinestMiris Team</strong><br>
                <a href="emailto:no-reply@finestmiris.com" style="color: #136207; text-decoration: none;">no-reply@finestmiris.com</a>
                </p>
            </div>
            </div>`;
            const emailOptions = {
                from: '"FinestMiris" <no-reply@finestmiris.com>',
                to: email,
                subject: 'Potvrda porudžbine – FinestMiris',
                html: htmlBody
            };
            transporter.sendMail(emailOptions, (error, info) => {
                if (error) {
                    console.error('order email error', error);
                    res.status(500).json({ message: 'error sending email' });
                }
                else {
                    res.json({ message: 'order email sent' });
                }
            });
        };
        this.updatePassword = (req, res) => {
            users_1.default.collection.updateOne({ "username": req.body.username }, { $set: { "password": req.body.new_pass, "tempPass": null, "timeStamp": null } }, () => {
                res.json("updated");
            });
        };
        // Secure change password endpoint: verifies old password (or tempPass), hashes new password and updates user
        this.changePassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const username = req.body.username;
            const old_pass = req.body.old_pass;
            const new_pass = req.body.new_pass;
            if (!username || !old_pass || !new_pass) {
                res.status(400).json({ message: 'missing fields' });
                return;
            }
            try {
                const user = yield users_1.default.findOne({ username: username }).exec();
                if (!user) {
                    res.status(404).json({ message: 'user not found' });
                    return;
                }
                // Allow reset flow: if tempPass matches and not expired
                let allowed = false;
                if (user.tempPass && old_pass == user.tempPass) {
                    // check expiry (30 minutes)
                    const expiryMs = 30 * 60 * 1000;
                    if ((new Date()).getTime() - user.timeStamp.getTime() <= expiryMs) {
                        allowed = true;
                    }
                    else {
                        res.status(400).json({ message: 'temporary password expired' });
                        return;
                    }
                }
                // Otherwise compare existing hashed password
                if (!allowed) {
                    const match = yield bcrypt.compare(old_pass, user.password);
                    if (!match) {
                        res.status(401).json({ message: 'old password incorrect' });
                        return;
                    }
                }
                // Hash new password and update
                const hashed = yield bcrypt.hash(new_pass, 10);
                user.password = hashed;
                user.tempPass = null;
                user.timeStamp = null;
                yield user.save();
                res.json({ message: 'password updated' });
            }
            catch (err) {
                console.error('changePassword error', err);
                res.status(500).json({ message: 'server error' });
            }
        });
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
    generateToken(name) {
        // simple random token - could be replaced with JWT
        const rand = Math.random().toString(36).slice(2) + Date.now().toString(36);
        return rand;
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map