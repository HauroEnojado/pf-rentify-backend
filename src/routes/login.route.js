const { Router } = require('express')
const router = Router()
const { login } = require('../controller/login.controller.js')
router.post('/login-google', login)

module.exports = router