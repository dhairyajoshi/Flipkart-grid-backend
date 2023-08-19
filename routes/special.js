const express = require('express')
const userModel = require('../models/userModel')
const transactionModel = require('../models/transactionModel')
const productModel = require('../models/productModel')
const rewardModel = require('../models/rewardModel')
const adminCheck = require('../middlewares/adminCheck')
const router = express.Router()

router.post('/', adminCheck, async (req, res, next) => {
    await userModel.deleteMany().exec()
    await transactionModel.deleteMany()
    await productModel.deleteMany()
    await rewardModel.deleteMany()

    res.json({ msg: 'Database cleared' })
})

module.exports = router