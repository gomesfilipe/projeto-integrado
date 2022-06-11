const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Item = new Schema({
    id_product: {
        type: String,
        required: true
    },

    id_store: {
        type: String,
        required: true
    },

    id_sale: {
        type: String,
    },

    quantity: {
        type: Number,
        required: true
    }
})

mongoose.model('items', Item)
module.exports = Item
