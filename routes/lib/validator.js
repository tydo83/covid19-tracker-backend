const { isEmpty, isEmail, matches } = require("validator")
const mongoDBErrorHelper = require('./mongoDBErrorHelper')

const checkIfEmpty = (target) => {
    if (isEmpty(target)) {
        return true;
    } else {
        return false;
    }
};

const checkIfEmail = (target) => {
    if (isEmail(target)) {
        return true;
    } else {
        return false;
    }
};

const checkForSymbol = (target) => {
    if (matches(target, /[!@#$%^&*()\[\],.?":;{}|<>]/g)) {
        return true;
    } else {
        return false;
    }
};

const checkIfEmptyMiddleware = (req, res, next) => {
    let errObj = {};
    let checkedEmail = false;

    const { email, password, firstName, lastName } = req.body;

    if (checkIfEmpty(firstName)) {
        errObj.firstName = "First Name cannot be empty";
    }
    if (checkIfEmpty(lastName)) {
        errObj.lastName = "Last Name cannot be empty";
    }
    if (checkIfEmpty(email)) {
        errObj.email = "Email cannot be empty";
        checkedEmail = true;
    }
    if (!checkedEmail) {
        if (!checkIfEmail(email)) {
            errObj.email = "It must be in email format"
        }
    }
    if (checkIfEmpty(password)) {
        errObj.password = "Password cannot be empty";
    }
    if (Object.keys(errObj).length > 0) {
        res.status(500).json(mongoDBErrorHelper({ message: errObj }))
    } else {
        next();
    }
}

const checkForSymbolMiddleware = (req, res, next) => {
    let errObj = {}
    let { firstName, lastName } = req.body;

    if (checkForSymbol(firstName)) {
        errObj.firstName = "First Name cannot contain special characters"
    }
    if (checkForSymbol(lastName)) {
        errObj.lastName = "Last Name cannot contain special characters"
    }
    if (Object.keys(errObj).length > 0) {
        res.status(500).json(mongoDBErrorHelper({ message: errObj }))
    } else {
        next();
    }
}

const checkLoginIsEmpty = (req, res, next) => {
    let errObj = {};

    const { email, password } = req.body;

    if (checkIfEmpty(email)) {
        errObj.email = "Email cannot be empty";
    }
    if (checkIfEmpty(password)) {
        errObj.password = "Password cannot be empty";
    }
    if (Object.keys(errObj).length > 0) {
        res.status(500).json(mongoDBErrorHelper({ message: errObj }))
    } else {
        next();
    }
}


module.exports = {
    checkIfEmptyMiddleware,
    checkForSymbolMiddleware,
    checkLoginIsEmpty,
}