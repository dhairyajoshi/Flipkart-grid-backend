const express = require('express')

const router = express.Router()

const sellerController = require('../controllers/sellerController')
const sellerCheck = require('../middlewares/sellerCheck')
const authCheck = require('../middlewares/authCheck')

router.post('/addproduct', sellerCheck, sellerController.addProduct)

router.get('/topcustomers',sellerCheck,sellerController.getTopCustomers)

module.exports = router 