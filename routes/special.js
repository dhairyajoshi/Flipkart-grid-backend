const express = require('express')
const userModel = require('../models/userModel')
const transactionModel = require('../models/transactionModel')
const productModel = require('../models/productModel')
const router = express.Router()

router.post('/', async (req, res, next) => {
    await userModel.deleteMany().exec()
    await transactionModel.deleteMany()
    await productModel.deleteMany()

    res.json({ msg: 'Database cleared' })
})

module.exports = router