const productModel = require("../models/productModel")
const mongoose = require('mongoose')
const userModel = require("../models/userModel")
const contract = require('./contractController')
const transactionModel = require("../models/transactionModel")

function getCurrentDateTime() {
    const now = new Date();

    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const year = now.getFullYear();

    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    return `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
}


module.exports.getAllProducts = async (req, res, next) => {
    const result = await productModel.find()

    res.status(200).json({ ...result })
}

module.exports.buy = async (req, res, next) => {
    const productId = req.body.productId
    const product = await productModel.findById(productId)
    const user = await userModel.findById(req.UserData.userId)
    const seller = await userModel.findById(product.seller)
    const productPrice = product.price
    const supercoins = req.body.supercoins ? req.body.supercoins : 0

    try {
        if (productPrice + supercoins <= user.account) {
            user.account -= productPrice - supercoins
            seller.account += productPrice
            user.save()
            seller.save()
            if (supercoins > 0)
                await contract.transfer(user.walletAddress, undefined, supercoins)
            await contract.addReward(user.walletAddress, productPrice * 0.05)
            await contract.addReward(seller.walletAddress, productPrice * 0.05)

            const transaction = new transactionModel({
                _id: new mongoose.Types.ObjectId(),
                name: product.name,
                user: user._id,
                product: product._id,
                seller: seller._id,
                date: getCurrentDateTime(),
                price: product.price,
                supercoins: supercoins,
                rewardEarned: productPrice * 0.05
            })

            await transaction.save()

            user.transactions.push(transaction);
            user.save();

            res.status(200).json({ msg: 'product ordered successfully' })
        } else {
            res.status(400).json({ msg: 'Not enough money to purchase!' })
        }
    } catch (err) {
        console.log(err)
        res.status(400).json({ msg: err })
    }



}