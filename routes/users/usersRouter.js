var express = require('express');
var router = express.Router();
var { checkIfEmptyMiddleware, checkForSymbolMiddleware, checkLoginIsEmpty } = require('../lib/validator')
var { checkIsUserHaveValidToken } = require('../lib/authChecker')


var { signUp, login, updateUserPassword } = require('./controller/userController')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/sign-up', checkIfEmptyMiddleware, checkForSymbolMiddleware, signUp);
router.post('/login', checkLoginIsEmpty, login)
router.put('/update-password', checkIsUserHaveValidToken, updateUserPassword)

module.exports = router;
