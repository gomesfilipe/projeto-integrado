const express = require('express')
const app = express()
const store = require('./routes/store')
const product = require('./routes/product')
const sale = require('./routes/sale')
const item = require('./routes/item')

// Middleware.
app.use(express.json())

app.use('/store', store) // /store é o prefixo para acessar as rotas desse grupo.
app.use('/product', product) // /product é o prefixo para acessar as rotas desse grupo.
app.use('/sale', sale) // /sale é o prefixo para acessar as rotas desse grupo.
app.use('/item', item) // /item é o prefixo para acessar as rotas desse grupo.

module.exports = app
