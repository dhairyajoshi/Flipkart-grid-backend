const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "GridTransaction" }],
    account: { type: Number, default: 65000 },
    walletAddress: { type: String, default: "" },
    supercoins: { type: Number, default: 0 },
    rewardHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "GridRewardHistory" }],
    role: { type: String, default: "customer" },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "GridProduct" }],
    referral_code: { type: String }
})

module.exports = mongoose.model("GridUser", UserSchema)   