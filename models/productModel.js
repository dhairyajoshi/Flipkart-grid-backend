const mongoose = require('mongoose')

const ProductSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    seller_id: { type: mongoose.Schema.Types.ObjectId, ref: "GridUser" },
    seller_name:{type:String},
    price: {type:Number, required:true},
    rating: {type:Number, default:0}
    
})

module.exports = mongoose.model("GridProduct", ProductSchema)    