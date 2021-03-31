const jwt = require("jsonwebtoken")
const mongoDBErrorHelper = require("./mongoDBErrorHelper")

const checkIsUserHaveValidToken = async (req, res, next) => {
    try {
        if (req.headers && req.headers.authorization) {
            let jwtToken = req.headers.authorization.slice(7)
            let decodedJWT = jwt.verify(jwtToken, process.env.JWT_SECRET);
            if (decodedJWT) {
                next();
            }
        } else {
            throw { message: "You don't have a permission, please login" }
        }
    } catch (e) {
        res.status(500).json(mongoDBErrorHelper(e))
    }
}

module.exports = { checkIsUserHaveValidToken }