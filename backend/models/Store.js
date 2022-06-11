const mongoose = require('mongoose')
// const Product = require('./Product')
const Schema = mongoose.Schema

const Store = new Schema({
    name: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    admin_password: {
        type: String,
        required: true
    },

    products: [{
        type: Schema.Types.ObjectId,
        ref: 'products'
    }],

    sales: [{
        type: Schema.Types.ObjectId,
        ref: 'sales'
    }]
})

mongoose.model('stores', Store)
module.exports = Store
