const mongoose = require('mongoose')

const RewardHistorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "GridUser" },
    amount: {type:Number},
    received: {type:Boolean},
    transaction: { type: mongoose.Schema.Types.ObjectId, ref: "GridTrans" }
 
})

module.exports = mongoose.model("RewardHistory", RewardHistorySchema)    