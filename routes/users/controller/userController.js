const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../Model/User');
const mongoDBErrorHelper = require('../../lib/mongoDBErrorHelper')

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

module.exports = {
    signUp: async (req, res) => {
        try {
            let salted = await bcrypt.genSalt(10);
            let hashedPassword = await bcrypt.hash(req.body.password, salted)

            let createdUser = await new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: hashedPassword,
            })

            let savedUser = await createdUser.save();

            res.json({
                data: savedUser,
            })
        } catch (e) {
            console.log(e.message)
            res.status(500).json(mongoDBErrorHelper(e))
        }
    },
    login: async (req, res) => {
        try {
            let foundUser = await User.findOne({ email: req.body.email });
            if (!foundUser) {
                throw { message: "Email is not registered, please go sign up!" };
            }
            let comparedPassword = await bcrypt.compare(
                req.body.password,
                foundUser.password
            );
            console.log(comparedPassword)
            if (!comparedPassword) {
                throw { message: "Check your email and password!" }
            } else {
                let jwtToken = jwt.sign(
                    {
                        email: foundUser.email,
                    }
                    ,
                    process.env.JWT_SECRET,
                    { expiresIn: "1hr" }
                )
                res.json({
                    jwtToken: jwtToken
                })
            }
        } catch (e) {
            console.log(39, e)
            res.status(500).json(mongoDBErrorHelper(e))
        }
    },
    updateUserPassword: async (req, res) => {
        try {
            let foundUser = await User.findOne({ email: req.body.email });

            if (!foundUser) {
                throw { message: "User not found!!" }
            }
            let comparedPassword = await bcrypt.compare(
                req.body.oldPassword,
                foundUser.password
            );

            if (!comparedPassword) {
                throw { message: "Cannot update your password, please check again" }
            }

            let salted = await bcrypt.genSalt(10);
            let hashedNewPassword = await bcrypt.hash(req.body.newPassword, salted)

            let updatedUser = await User.findOneAndUpdate(
                { email: req.body.email },
                // req.body,
                { password: hashedNewPassword },
                { new: true });

            res.status(200).json({
                message: "successfully updated",
                payload: true,
            });
        } catch (e) {
            res.status(500).json(mongoDBErrorHelper(e))
        }
    },
    sendSMSTwilio: async (req, res) => {
        try {
            let sentSMS = await client.messages.create({
                body: `Hey ${req.body.targetUser.nickName}`,
                from: '+14159961498',
                to: '+13479970449'
            })
            res.json(sentSMS)
        } catch (e) {
            res.status(500).json(mongoDBErrorHelper(e))
        }
    }
}