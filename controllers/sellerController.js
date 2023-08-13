const productModel = require("../models/productModel")
const TransactionModel = require("../models/transactionModel")
const userModel = require("../models/userModel")
const mongoose = require('mongoose')
const contractController = require('./contractController')

module.exports.addProduct = async (req, res, next) => {
    const product = productModel({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        seller: req.UserData.userId,
        price: req.body.price,
        rating: req.body.rating
    })

    const seller = await userModel.findById(req.UserData.userId)

    product.save()

    seller.products.push(product)

    seller.save()

    res.status(201).json({ msg: 'Product added successfully' })
}

module.exports.getTopCustomers = async (req, res, next) => {
    const sellerId = new mongoose.Types.ObjectId(req.UserData.userId);
    const pipeline = [
        { $match: { seller: sellerId } },
        {
            $group: {
                _id: "$user",
                totalAmount: { $sum: "$price" },
                orders: { $push: "$$ROOT" }
            }
        },
        { $sort: { totalAmount: -1 } }
    ];

    const result = await TransactionModel.aggregate(pipeline);

    const data = result.map(item => ({
        customer: item._id,
        totalAmount: item.totalAmount,
        orders: item.orders
    }));

    res.status(200).json(data)
}

module.exports.rewardCustomer = async (req, res, next) => {
    try {

        customerId = req.body.customerId
        supercoins = req.body.supercoins
        user = await userModel.findById(customerId)
        seller = await userModel.findById(req.UserData.userId)

        await contractController.transfer(seller.walletAddress, user.walletAddress, supercoins)

        res.status(200).json({ 'msg': "customer rewarded successfully" })
    } catch (err) {
        res.status(500).json({ 'msg': "some error occurred" })
    }

}