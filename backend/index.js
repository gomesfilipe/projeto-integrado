const express = require('express')
const app = express()
const store = require('./routes/store')
const product = require('./routes/product')
const mongoose = require('mongoose')

// Configuração mongoose.
// mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/sisve')
    .then(() => console.log('Connected database!'))
    .catch(() => console.log('Error to connect database.'))

// Rodando servidor
const port = 8081
app.listen(port, () => {
    console.log(`The server is running in http://localhost:${port}`)
})

// Middleware.
app.use(express.json())

// Usando rotas user
app.use('/store', store) // /store é o prefixo para acessar as rotas desse grupo.
app.use('/product', product) // /store é o prefixo para acessar as rotas desse grupo.

// const Product = require('./models/Product')
// const Store = require('./models/Store')

// TODO
// Ajeitar chaves de busca para produtos e lojas. (De preferência IDs)
// Fazer validação dos dados.
// Verificar se já existe produto ou loja com mesmo nome no CRUD.
// Ver como inserir produtos na lista de produtos de uma loja específica. //!OK
// Ajeitar model de produtos (todo produto pertence a uma loja). //! OK
// Fazer model e CRUD de vendas.
// Ver como fazer busca no banco de dados num intervalo entre duas datas para os dashboards.
// Fazer interface da API.
