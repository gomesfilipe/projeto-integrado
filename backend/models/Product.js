const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Product = new Schema({
    name: {
        type: String,
        required: true
    },

    cost: {
        type: Number,
        required: true
    },

    sale: {
        type: Number,
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },
    
    // photo: {
    //     type: String,
    //     required: true
    // },

    unity: {
        type: String,
        required: true
    },

    id_store: {
        type: String,
        required: true
    },

    min: {
        type: Number,
        required: true
    }
})

mongoose.model('products', Product)
module.exports = Product
