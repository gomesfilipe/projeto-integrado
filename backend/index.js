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

// Configuração Swagger.
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

//? JÁ FEITOS
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
// Fazer testes das validações já feitas (de parâmetros vindos do req.body e dos parâmetros numéricos). //!OK
// Colocar middleware para verificar se o usuário logado está fazendo ações na própria loja. (usar campo req.id_store). //!OK
// Usar req.id_store nas rotas que usam id_store, para o usuário não ter a responsabilidade de saber o id da loja. //!OK

//? BAIXA PRIORIDADE
// Ver como validar datas no formato ISO.
// Definir critérios de validação de username, password e admin_password.
// Ver como fazer upload de imagens (ou remover este campo).
// Fazer verificação se a quantidade de itens é menor ou igual ao estoque.
// Além da mensagem de sucesso, enviar os dados do produto / venda / loja / item cadastrados pelo cliente. (decidir).
// Passar cadastro de loja para o grupo de rotas store.
// Desfazer grupo de rotas nologged e criar um novo grupo para login/logout.
// Ver como fazer o middleware atuar numa rota específica e não no arquivo inteiro de rota (para fazer o resquisito acima).

//? ALTA PRIORIDADE
// Fazer scripts de testes.
// Ver documentação do describe.
// Mudar implementação da rota de deletar loja (deve excluir os produtos, itens e vendas associadas a ela). 
// Fazer verificação se loja existe no cadastro de produtos.
// No cadastro de produto deve verificar se o id da loja existe.
// No cadastro de item deve verificar se o id da loja e produto existem.
// Mudar implementação da rota de consultar venda entre datas. Parâmetros devem ser dia, mês e ano no path.
// Fazer rota de logout (cancelar token).
// Fazer tratamento de paginação na rota busca de produtos por nome (se passar número de página muito grande).
// Colocar id da venda nos itens após fechar uma venda.
// Fazer rota para dar get nos produtos abaixo do estoque mínimo (decidir se vai implementar ou não, teria que inserir um campo de estoque mínimo). //? BAIXA PRIORIDADE
// Edição de username de loja, nome de produto não pode deixar ocorrer repetição.
// Cancelar token ao deletar loja.
// Colocar admin_password no path da rota de deletar loja.
