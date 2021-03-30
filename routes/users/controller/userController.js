const User = require('../Model/User')
const bcrypt = require('bcryptjs')

module.exports = {
    signUp: async(req, res) => {
        try {
            let salted = await bcrypt.genSalt(10);
            let hashedPassword = await bcrypt.hash(req.body.password, salted);

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
        } catch(e) {
            res.status(500).json({
                message: e,
            })
        }
    },
    login: async(req, res) => {
        try {
            let foundUser = await User.findOne({ email: req.body.email });
            if(!foundUser) {
                throw { message: "Email is not registered, please sign up" };
            }
            let comparedPassword = await bcrypt.compare(
                req.body.password,
                foundUser.password,
            );
            if(!comparedPassword) {
                throw { message: "Please check your email and password"}
            } else {
                res.json({
                    message: "success"
                })  
            }

        } catch(e) {
            res.status(500).json({
                message: e,
            })
        }
    }
}