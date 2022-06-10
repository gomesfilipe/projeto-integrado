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
    }]
})

mongoose.model('stores', Store)

// const Loja = mongoose.model('stores')

// new Loja({
//     name: 'loja',
//     username: 'teste',
//     password: '123',
//     admin_password: '123',
// }).save()
//     .then(() => console.log('cadastrado com sucesso'))
//     .catch((err) => console.log('erro ao cadastrar ' + err))

module.exports = Store
