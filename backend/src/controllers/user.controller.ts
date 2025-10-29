import * as express from "express";
import { Request, Response } from "express-serve-static-core";
import { appendFile } from "fs";
import { ParsedQs } from "qs";
import User from "../models/users"
import * as bcrypt from 'bcryptjs';
import TokenModel from '../models/tokens'

export class UserController {

    register = (req: express.Request, res: express.Response) => {
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
            let user = new User({
                email: email,
                username: username,
                password: hash,
            })

            user.save().then(user => {
                res.status(200).json({ "message": "user added" });
            }).catch(err => {
                console.error(err);
                res.status(400).json({ "message": "error" })
            })
        }).catch(err => {
            console.error(err);
            res.status(500).json({ message: 'hash error' });
        });
    }

    // POST { email }
    checkMail = (req: express.Request, res: express.Response) => {
        // accept either { email } or { email } from clients
        const email = req.body.email || req.body.email;

        if (!email) {
            // missing payload - client should send an e-email to check
            res.status(400).json({ exists: false });
            return;
        }

        // Look up user by email and return a clear exists boolean
        User.findOne({ email: email }, (err, user) => {
            if (err) {
                console.error('checkMail error', err);
                res.status(500).json({ exists: false });
                return;
            }

            res.status(200).json({ exists: !!user });
        });
    }

    addShippingInfo = (req: express.Request, res: express.Response) => {
        let user = new User({
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

        })

        User.updateOne({ "username": curr_sent },
            {
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
                if (err) console.log(err);
                else res.json(user);
            });

    }

    login = (req: express.Request, res: express.Response) => { //req se koristi za Requests, a povratna vrednost je res, tj. Response
        let username = req.body.username; //dohvata usernamer iz tela
        let password = req.body.password; //dohvata possword iz tela
        User.findOne({ username: username }, async (err, user) => {
            if (err) { console.error(err); res.json(null); return; }
            if (!user) { res.json(null); return; }

            // check tempPass first (reset flow)
            if (user.tempPass && password == user.tempPass) {
                if ((new Date()).getTime() - (user.timeStamp.getTime() + 1800000) >= 0) //30 minutes
                    user.status = "Reset password expired";
                res.json(user); return;
            }

            // compare hashed password
            const match = await bcrypt.compare(password, user.password);
            if (!match) { res.json(null); return; }

            // generate token and save
            const token = this.generateToken(username);
            const tokenDoc = new TokenModel({ username: username, token: token, email: user.email });
            tokenDoc.save().catch(e => console.error('token save error', e));

            // Return user + token
            const userObj = user.toObject();
            userObj.token = token;
            res.json(userObj);
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

    logout = (req: express.Request, res: express.Response) => {
        const username = req.body.username;
        const token = req.body.token;
        if (!username || !token) { res.status(400).json({ message: 'missing' }); return; }
        TokenModel.deleteOne({ username: username, token: token }, (err) => {
            if (err) { console.error(err); res.status(500).json({ message: 'error' }); return; }
            res.json({ message: 'logged out' });
        });
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

        var emailOptions = {
            from: 'cirkovic32.mi@gmail.com',
            to: email,
            subject: 'Password reset @no-reply',
            text: 'Hello from Art Gallery, \n\nYour reset password is: ' + temp_password + "\n\n P.S.IF YOU DIDN'T INITIATE PASSWORD RESET, IGNORE THIS E-MAIL!"
        };

        let statement: boolean = false;

        transporter.sendMail(emailOptions, (error, info) => {
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
        User.updateOne({ "email": email }, {
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

    // Request a short-lived numeric verification code sent to the user's email
    // POST { email }
    requestReset = async (req: express.Request, res: express.Response) => {
        const nodemailer = require('nodemailer');
        const email = req.body.email || req.body.mail;

        if (!email) { res.status(400).json({ message: 'missing email' }); return; }

        try {
            const user = await User.findOne({ email: email }).exec();

            // Always respond with success to avoid leaking registered emails
            // but only generate/send code if user exists
            if (!user) { res.json({ message: 'mail sent' }); return; }

            // generate 6-digit numeric code
            const code = Math.floor(100000 + Math.random() * 900000).toString();

            // store code and timestamp (used for 5 minute expiry)
            user.tempPass = code;
            user.timeStamp = new Date();
            await user.save();

            // configure transporter (reuse existing credentials)
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'cirkovic32.mi@gmail.com',
                    pass: 'lriyeiguroelkawg'
                },
                tls: { rejectUnauthorized: false }
            });

            const mailOptions = {
                from: '"FinestMiris" <no-reply@finestmiris.com>',
                to: email,
                subject: 'Your verification code',
                text: `Your verification code is: ${code}. It is valid for 5 minutes.`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('requestReset sendMail error', error);
                    // still respond success so we don't leak info
                    res.json({ message: 'mail sent' });
                } else {
                    res.json({ message: 'mail sent' });
                }
            });
        } catch (err) {
            console.error('requestReset error', err);
            res.status(500).json({ message: 'server error' });
        }
    }

    // Verify code: POST { email, code }
    verifyCode = async (req: express.Request, res: express.Response) => {
        const email = req.body.email || req.body.mail;
        const code = req.body.code;

        if (!email || !code) { res.status(400).json({ verified: false, message: 'missing fields' }); return; }

        try {
            const user = await User.findOne({ email: email }).exec();
            if (!user || !user.tempPass || !user.timeStamp) { res.status(400).json({ verified: false, message: 'invalid or expired code' }); return; }

            const expiryMs = 5 * 60 * 1000; // 5 minutes
            if ((new Date()).getTime() - user.timeStamp.getTime() > expiryMs) {
                res.status(400).json({ verified: false, message: 'code expired' }); return;
            }

            if (user.tempPass !== code) { res.status(400).json({ verified: false, message: 'code incorrect' }); return; }

            res.json({ verified: true });
        } catch (err) {
            console.error('verifyCode error', err);
            res.status(500).json({ verified: false, message: 'server error' });
        }
    }

    // Reset password using email + code. POST { email, code, new_pass }
    resetPassword = async (req: express.Request, res: express.Response) => {
        const email = req.body.email || req.body.mail;
        const code = req.body.code;
        const new_pass = req.body.new_pass;

        if (!email || !code || !new_pass) { res.status(400).json({ message: 'missing fields' }); return; }

        try {
            const user = await User.findOne({ email: email }).exec();
            if (!user || !user.tempPass || !user.timeStamp) { res.status(400).json({ message: 'invalid or expired code' }); return; }

            const expiryMs = 5 * 60 * 1000; // 5 minutes
            if ((new Date()).getTime() - user.timeStamp.getTime() > expiryMs) {
                res.status(400).json({ message: 'code expired' }); return;
            }

            if (user.tempPass !== code) { res.status(400).json({ message: 'code incorrect' }); return; }

            // hash and update
            const hashed = await bcrypt.hash(new_pass, 10);
            user.password = hashed;
            user.tempPass = null;
            user.timeStamp = null;
            await user.save();

            res.json({ message: 'password reset' });
        } catch (err) {
            console.error('resetPassword error', err);
            res.status(500).json({ message: 'server error' });
        }
    }

    // Send order confirmation email. Expects { email, shipping, cart }
    order = (req, res) => {
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
        } catch (e) {
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

        // Read SMTP config from environment so prod and dev can differ
        const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
        const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
        const smtpSecure = (process.env.SMTP_SECURE || 'true') === 'true';
        const smtpUser = process.env.SMTP_USER || 'cirkovic32.mi@gmail.com';
        const smtpPass = process.env.SMTP_PASS || 'lriyeiguroelkawg';

        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpSecure,
            auth: {
                user: smtpUser,
                pass: smtpPass
            },
            tls: { rejectUnauthorized: false },
            // short timeouts so a blocked network doesn't hang the request
            connectionTimeout: 10000,
            greetingTimeout: 5000,
            socketTimeout: 10000
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

        try {
            // use Promise API
            const info = transporter.sendMail(emailOptions);
            console.log('order email sent', info && info.messageId);
            res.json({ message: 'order email sent' });
        } catch (error) {
            // Log the error and return a non-fatal response so user flow continues
            console.error('order email error', error);
            // 202 Accepted: we received the order but email delivery failed for now
            res.status(202).json({ message: 'order received; email delivery failed' });
        }
    };



    updatePassword = (req: express.Request, res: express.Response) => {
        User.collection.updateOne({ "username": req.body.username }, { $set: { "password": req.body.new_pass, "tempPass": null, "timeStamp": null } }, () => {
            res.json("updated");
        });
    }

    // Secure change password endpoint: verifies old password (or tempPass), hashes new password and updates user
    changePassword = async (req: express.Request, res: express.Response) => {
        const username = req.body.username;
        const old_pass = req.body.old_pass;
        const new_pass = req.body.new_pass;

        if (!username || !old_pass || !new_pass) {
            res.status(400).json({ message: 'missing fields' });
            return;
        }

        try {
            const user = await User.findOne({ username: username }).exec();
            if (!user) { res.status(404).json({ message: 'user not found' }); return; }

            // Allow reset flow: if tempPass matches and not expired
            let allowed = false;
            if (user.tempPass && old_pass == user.tempPass) {
                // check expiry (30 minutes)
                const expiryMs = 30 * 60 * 1000;
                if ((new Date()).getTime() - user.timeStamp.getTime() <= expiryMs) {
                    allowed = true;
                } else {
                    res.status(400).json({ message: 'temporary password expired' }); return;
                }
            }

            // Otherwise compare existing hashed password
            if (!allowed) {
                const match = await bcrypt.compare(old_pass, user.password);
                if (!match) { res.status(401).json({ message: 'old password incorrect' }); return; }
            }

            // Hash new password and update
            const hashed = await bcrypt.hash(new_pass, 10);
            user.password = hashed;
            user.tempPass = null;
            user.timeStamp = null;
            await user.save();

            res.json({ message: 'password updated' });
        } catch (err) {
            console.error('changePassword error', err);
            res.status(500).json({ message: 'server error' });
        }
    }

    generateToken(name: string) {
        // simple random token - could be replaced with JWT
        const rand = Math.random().toString(36).slice(2) + Date.now().toString(36);
        return rand;
    }
}