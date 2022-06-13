const express = require('express')
const app = express()
const store = require('./routes/store')
const product = require('./routes/product')
const sale = require('./routes/sale')
const item = require('./routes/item')
const nologged = require('./routes/no_logged')
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
app.use('/product', product) // /product é o prefixo para acessar as rotas desse grupo.
app.use('/sale', sale) // /sale é o prefixo para acessar as rotas desse grupo.
app.use('/item', item) // /item é o prefixo para acessar as rotas desse grupo.
app.use('/nologged', nologged)

// TODO
// Ajeitar chaves de busca para produtos e lojas. (De preferência IDs) //!OK (TROCADO PRA ID)
// Verificar se já existe produto ou loja com mesmo nome no CRUD. //!OK
// Ver como inserir produtos na lista de produtos de uma loja específica. //!OK
// Ajeitar model de produtos (todo produto pertence a uma loja). //! OK
// Fazer model e CRUD de vendas. //! OK
// Ver como fazer busca no banco de dados num intervalo entre duas datas para os dashboards. //!OK
// Fazer hash para as senhas. //!OK
// Fazer mais tipos de buscas para produtos (mais chaves de buscas além das IDs). //!OK
// Ver como fazer sessão de login. //!OK
// Passar todas as mensagens de erro para json. //!OK
// Fazer paginação nas rotas de consulta. //!OK
// Fazer validação dos dados.
// Fazer interface da API.

// TODO TESTES
// Testes CRUD Stores //!OK
// Testes CRUD Product //!OK
// Testes CRUD Sale //!OK
// Testes CRUD Item //!OK
