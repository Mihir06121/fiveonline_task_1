const express = require('express')
const router = express.Router()

const { formSubmit } = require('../controllers/formControllers')

router.post('/form-submit', formSubmit)

module.exports = router