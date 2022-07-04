const express = require('express')
// const app = express()
const app = require('./routes')
// const store = require('./routes/store')
// const product = require('./routes/product')
// const sale = require('./routes/sale')
// const item = require('./routes/item')
// const nologged = require('./routes/no_logged')
const mongoose = require('mongoose')

const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const port = 5500

// Configuração Swagger
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            openapi: '3.0.0',
            title: 'SISVE API',
            description: 'API para desenvolvimento do projeto SISVE',
            version: '1.0.0'
        },
        servers: [`http://localhost:${port}`]
    },
    apis: ['routes/item.js', 'routes/no_logged.js', 'routes/product.js', 'routes/sale.js', 'routes/store.js']
}


const swaggerDocs = swaggerJsdoc(swaggerOptions)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

// Configuração mongoose.
// mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/sisve')
    .then(() => console.log('Connected database!'))
    .catch(() => console.log('Error to connect database.'))

// Rodando servidor.
// const port = 8081
app.listen(port, () => {
    console.log(`The server is running in http://localhost:${port}`)
})

// // Middleware.
// app.use(express.json())

// Usando rotas user.
// app.use('/store', store) // /store é o prefixo para acessar as rotas desse grupo.
// app.use('/product', product) // /product é o prefixo para acessar as rotas desse grupo.
// app.use('/sale', sale) // /sale é o prefixo para acessar as rotas desse grupo.
// app.use('/item', item) // /item é o prefixo para acessar as rotas desse grupo.
// app.use('/nologged', nologged) // /nologged é o prefixo para acessar as rotas desse grupo.

// module.exports = app // Exportando app para poder executar os testes automatizados.

// TODO
// Ajeitar chaves de busca para produtos e lojas. (De preferência IDs) //!OK
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
// Fazer validação de parâmetros nas rotas. //!OK
// Fazer validação de dados numéricos //!OK
// Ver como validar datas no formato ISO.
// Definir critérios de validação de username, password e admin_password.
// Documentar para facilitar o desenvolvimento do front-end. (Swagger).
// Fazer testes das validações já feitas (de parâmetros vindos do req.body e dos parâmetros numéricos).
// Fazer scripts de testes.
// Ver documentação do describe.
// Mudar implementação da rota de deletar loja (deve excluir os produtos e vendas associadas a ela).
// Fazer verificação se loja existe no cadastro de produtos.
// Remover campo admin_password da model Store.
// Ver como fazer upload de imagens (ou remover este campo).
// No cadastro de produto deve verificar se o id da loja existe.
// No cadastro de item deve verificar se o id da loja e produto existem.
// Colocar middleware para verificar se o usuário logado está fazendo ações na própria loja.

// TODO TESTES
// Testes CRUD Stores //!OK
// Testes CRUD Product //!OK
// Testes CRUD Sale //!OK
// Testes CRUD Item //!OK
