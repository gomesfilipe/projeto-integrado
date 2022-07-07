const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

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
        required: true,
        select: false // Quando der get no json, esse campo não é enviado.
    },

    admin_password: {
        type: String,
        required: true,
        select: false // Quando der get no json, esse campo não é enviado.
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

// Store.pre('save', async function(next) {
//     // Verificação para garantir que as senhas só são encriptadas no cadastro, 
//     // e não no cadastro de produtos.
//     if(this.password != undefined && this.admin_password != undefined) {
//         const hash_password = await bcrypt.hash(this.password, 10)
//         this.password = hash_password

//         const hash_admin_password = await bcrypt.hash(this.admin_password, 10)
//         this.admin_password = hash_admin_password
//     }

//     next()
// })

mongoose.model('stores', Store)
module.exports = Store
