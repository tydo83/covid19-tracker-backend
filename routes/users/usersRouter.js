var express = require('express');
var router = express.Router();
var { signUp, login } = require('./controller/userController')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/sign-up', signUp);
router.post('/login', login)

module.exports = router;
