const express = require('express')

const router = express.Router()

const sellerController = require('../controllers/sellerController')
const sellerCheck = require('../middlewares/sellerCheck')

router.post('/addproduct', sellerCheck, sellerController.addProduct)

router.get('/topcustomers',sellerCheck,sellerController.getTopCustomers)

router.post('/rewardcustomer',sellerCheck,sellerController.rewardCustomer)

module.exports = router 