const express = require('express')
const authCheck = require('../middlewares/authCheck')
const router = express.Router()
const userController = require('../controllers/userController')

router.post('/signup', userController.signUp)
router.post('/login', userController.logIn)
router.get('/allorders', authCheck, userController.getAllOrders)
router.get('/cur', authCheck, userController.getUser)

module.exports = router