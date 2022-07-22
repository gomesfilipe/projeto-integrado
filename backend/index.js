const express = require('express')
// const app = express()
const app = require('./routes')
const mongoose = require('mongoose')

const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const port = 8000

// Configuração Swagger.
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            openapi: '3.0.0',
            title: 'Sistema de Vendas e Estoque (SISVE) API',
            description: 'Documentação da API para desenvolvimento do projeto SISVE.',
            version: '2.0.0'
        },
        servers: [`http://localhost:${port}`]
    },
    apis: ['routes/item.js', 'routes/no_logged.js', 'routes/product.js', 'routes/sale.js', 'routes/store.js']
}

const swaggerDocs = swaggerJsdoc(swaggerOptions)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

// Configuração mongoose.
mongoose.connect('mongodb://localhost/sisve')
    .then(() => console.log('Connected database!'))
    .catch(() => console.log('Error to connect database.'))

// Rodando servidor.
app.listen(port, () => {
    console.log(`The server is running in http://localhost:${port}`)
    console.log(`Access http://localhost:${port}/docs to read the API docs`)
})

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
// Colocar admin_password no body da requisição na rota de deletar loja. //!OK
// Retirar presave do model de stores e passar hash das senhas para a rota de cadastro de loja. //!OK
// Edição de username de loja, nome de produto não pode deixar ocorrer repetição. //!OK
// Fazer tratamento de paginação na rota busca de produtos por nome (se passar número de página muito grande). //!OK
// Mudar implementação da rota de consultar vendas entre datas. Parâmetros devem ser dia, mês e ano no path. //!OK
// Ver como fazer o middleware atuar numa rota específica e não no arquivo inteiro de rota (para fazer o resquisito acima). //!OK
// Mudar get de loja por id pra get na própria loja. //!OK
// Tirar middleware da rota get all lojas. //!OK
// Tirar middleware da rota get all products. //!OK
// Tirar middleware da rota get all sales. //!OK
// Mudar get de produto por id pra get de produtos da propria loja (fazer paginação???) //!OK
// Fazer rota get para pegar todas as vendas da loja. //!OK
// Adaptar rotas para fazer as ações da loja que está logada. //!OK
// Adaptar o crud de vendas, remover post e delete no crud de itens. //!OK
// Descontar estoque no cadastro de vendas. //!OK
// Fazer verificação se a quantidade de itens é menor ou igual ao estoque. //!OK
// Mudar implementação da rota de deletar loja (deve excluir os produtos, itens e vendas associadas a ela). //!OK
// Remover campo photo do model de produtos. //!OK
// Desfazer grupo de rotas nologged e colocar as rotas no grupo de rotas store. //!OK
// Além da mensagem de sucesso, enviar os dados do produto / venda / loja cadastrados pelo cliente. (decidir). //!OK
// Definir critérios de validação de username, password e admin_password. //!OK
// Não deixar acessar rota de login nem de cadastro de loja quando estiver logado. //!OK
// Conferir documentação e melhorá-la com mais detalhes. //!OK
// Quando deleta uma venda precisa tirar ela da lista de vendas da loja. //!OK
// Adicionar campo min na model de produtos //!OK
// Mudar rotas post e put de product para adaptar ao campo min //!OK
// Fazer rota de get produtos abaixo de min //!OK
// Atualizar documentação de products //!OK
// Corrigir documentação da rota de login (o json do response 200 está errado). //!OK
// Colocar validação de valores negativos no cadastro / edição de produto. //!OK
// Fazer scripts de testes. //!OK
// Testes Store //!OK
// Testes Product //!OK
// Testes Sale //!OK
// Testes Item //!OK
// Colocar expect(statusCode) nos testes já feitos. //!OK
// Ajeitar a edição de loja, não permitir editar senha e senha de administrador. //!OK

// TODO
// Fazer rota para gerar os dashboards.
    // Faturamento num período de tempo.
    // Quantidade de vendas num período de tempo.

// Colocar async/await nas rotas de get de loja.
// Diminuir tempo do token de validação para 3600 segundos.
