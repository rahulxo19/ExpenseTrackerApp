const express = require('express')

const form = require('../controllers/form')

const signup = require('../controllers/users')

const purchase = require('../controllers/purchase')

const authentication = require('../middleware/auth')

const router = express.Router();

router.post('/login', signup.login)

router.post('/', signup.postUser);

router.get('/premium', authentication.Auth, purchase.purchaseMembership)

router.post('/updatepremium', authentication.Auth, purchase.updateMembership)

router.get('/expense', form.getDetail);

router.get('/expenses', authentication.Auth, form.getDetails);

router.post('/expenses', authentication.Auth, form.postDetail);

router.delete('/expenses', form.delExpense);

module.exports = router;