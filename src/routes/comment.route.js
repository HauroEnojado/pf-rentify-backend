const { Router } = require('express')

const { newComment } = require('../controller/comment.controller.js')

const router = Router()

// metodos post
router.post('/', newComment)

module.exports = router