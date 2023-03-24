const express = require('express')

const form = require('../controllers/form')

const router = express.Router();
router.delete('/:name', form.deleteUser);

router.post('/', form.postDetails);

router.get('/', form.getDetails);


module.exports = router;