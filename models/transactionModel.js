const mongoose = require('mongoose')

const TransactionModel = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "GridUser" },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "GridProduct" },
    seller_id: { type: mongoose.Schema.Types.ObjectId, ref: "GridUser" },
    seller_name:{type:String},
    date: { type: String },
    price: { type: Number },
    supercoins: { type: Number, default: 0 },
    rewardEarned: { type: Number }

})

module.exports = mongoose.model("GridTrans", TransactionModel)    