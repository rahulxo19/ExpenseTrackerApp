const express = require('express')

// const form = require('../controllers/form')

const signup = require('../controllers/users')

const router = express.Router();

router.post('/login', signup.login)

router.post('/', signup.postUser);


// router.get('/del', form.getDetail);

// router.get('/', form.getDetails);

// router.post('/', form.postDetail);

// router.delete('/', form.delExpense);

module.exports = router;