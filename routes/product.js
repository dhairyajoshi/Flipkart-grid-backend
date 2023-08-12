const express = require('express')

const router = express.Router()

const productController = require('../controllers/productController')
const sellerCheck = require('../middlewares/sellerCheck')
const authCheck = require('../middlewares/authCheck')

router.get('/getall', productController.getAllProducts)
router.post('/buy', authCheck, productController.buy)

module.exports = router