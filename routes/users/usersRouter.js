var express = require('express');
var router = express.Router();
var { checkIfEmptyMiddleware, checkForSymbolMiddleware, checkLoginIsEmpty } = require('../lib/validator')
var { checkIsUserHaveValidJwtToken } = require('../lib/authChecker')


var { signUp, login } = require('./controller/userController')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/sign-up', checkIfEmptyMiddleware, checkForSymbolMiddleware, signUp);
router.post('/login', checkLoginIsEmpty, login)

module.exports = router;
