const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Sale = new Schema({
    items: [{
        type: Schema.Types.ObjectId,
        ref: 'items'
    }],

    date: {
        type: Date,
        default: new Date(),
    },

    value: {
        type: Number,
        required: true
    },

    id_store: {
        type: String,
        required: true
    }
})

mongoose.model('sales', Sale)
module.exports = Sale
