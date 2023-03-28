const express = require('express')

const form = require('../controllers/form')

const router = express.Router();

router.get('/del', form.getDetail);

router.get('/', form.getDetails);

router.post('/', form.postDetail);

router.delete('/', form.delExpense);

module.exports = router;