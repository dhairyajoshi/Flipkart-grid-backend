const express = require('express')

const router = express.Router()

const productController = require('../controllers/productController')
const authCheck = require('../middlewares/authCheck')

router.get('/getall',authCheck, productController.getAllProducts)

router.post('/buy', authCheck, productController.buy)

module.exports = router