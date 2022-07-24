const express = require('express')
const app = express()
const store = require('./routes/store')
const product = require('./routes/product')
const sale = require('./routes/sale')
const item = require('./routes/item')
const cors = require('cors')

app.use(cors()) // Middleware para permitir terceiros enviarem requisições a sua API.
app.use(express.json()) // Middleware para trabalhar com json nas requisições e respostas.
app.use('/store', store) // /store é o prefixo para acessar as rotas desse grupo.
app.use('/product', product) // /product é o prefixo para acessar as rotas desse grupo.
app.use('/sale', sale) // /sale é o prefixo para acessar as rotas desse grupo.
app.use('/item', item) // /item é o prefixo para acessar as rotas desse grupo.

module.exports = app
