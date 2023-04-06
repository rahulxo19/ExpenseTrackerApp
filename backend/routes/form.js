const express = require('express')

const form = require('../controllers/form')

const signup = require('../controllers/users')

const router = express.Router();

router.post('/login', signup.login)

router.post('/', signup.postUser);


router.get('/expense', form.getDetail);

router.get('/expenses', form.getDetails);

router.post('/expenses', form.postDetail);

router.delete('/expenses', form.delExpense);

module.exports = router;