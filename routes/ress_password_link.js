const express = require("express");
const router = express.Router();
const sign = require('jwt-encode');
const jwt_decode = require('jwt-decode');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Users = require("../models/users");


const bodyParser = require('body-parser');

router.post('/link', bodyParser.json(), async (req, res, next) => {
    try {
        // Generate a random token
        const token = crypto.randomBytes(20).toString('hex');

        // Find the user by email and save the reset token and expiration date
        const user = await Users.findOne({ email: req.body.email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
        console.log('useri mire', token)
        console.log('useri mire', Date.now() + 3600000)

        await user.save();

        // Send the email with the password reset link
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'elbaaak@gmail.com',
                pass: 'vrefrskyrtgymnab'
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            to: user.email,
            from: 'elbaaak@gmail.com',
            subject: 'Password Reset',
            text: `You are receiving this email because you (or someone else) has requested a password reset for your account.\n\n
            Please click on the following link, or paste it into your browser to complete the process:\n\n
            http://${req.headers.host}/api/reset-password/${token}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Password reset email sent' });
    } catch (err) {
        next(err);
    }
});

router.get('/reset-password/:token', async (req, res, next) => {
    console.log("first")
    try {
        // Find the user by reset token and ensure it hasn't expired
        const user = await Users.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } });
        console.log('user found:', user);
        console.log('req.params:', req.params);

        if (!user) {
            console.log('invalid or expired token');
            return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
        }

        // Update the user's password and clear the reset token fields
        console.log('setting new password');
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        const randomPassword = crypto.randomBytes(20).toString('hex');
        user.password = randomPassword;

        await user.save();

        // Send a confirmation email to the user
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'elbaaak@gmail.com',
                pass: 'vrefrskyrtgymnab'
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            to: user.email,
            from: 'elbaaak@gmail.com',
            subject: 'Your password has been changed',
            text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed to ${randomPassword}. We recomand changing the password after your first login :)\n`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Password reset successful' });
    } catch (err) {
        next(err);
    }
});



module.exports = router;