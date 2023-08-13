const mongoose = require('mongoose')

const TransactionModel = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "GridUser" },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "GridProduct" },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "GridUser" },
    date: { type: String },
    price: { type: Number },
    supercoins: { type: Number, default: 0 },
    rewardEarned: { type: Number }

})

module.exports = mongoose.model("GridTrans", TransactionModel)    