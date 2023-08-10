const mongoose = require('mongoose')

const ProductSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "GridUser" },
    price: {type:Number, required:true},
    rating: {type:Number, default:0}
    
})

module.exports = mongoose.model("GridProduct", ProductSchema)    