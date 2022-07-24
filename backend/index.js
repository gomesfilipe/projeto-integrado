const app = require('./routes')
const mongoose = require('mongoose')
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
require('dotenv').config()

// Configuração Swagger.
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            openapi: '3.0.0',
            title: 'Sistema de Vendas e Estoque (SISVE) API',
            description: 'Documentação da API para desenvolvimento do projeto SISVE.',
            version: '3.0.0'
        },
        // servers: [`http://localhost:${port}`]
        servers: [`${process.env.API_HOST}:${process.env.API_PORT}`]
    },
    apis: ['routes/item.js', 'routes/no_logged.js', 'routes/product.js', 'routes/sale.js', 'routes/store.js']
}

const swaggerDocs = swaggerJsdoc(swaggerOptions)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

// Configuração mongoose.
mongoose.connect(`mongodb://${process.env.DB_HOST}/${process.env.DB_NAE}`)
    .then(() => console.log('Connected database!'))
    .catch(() => console.log('Error to connect database.'))

// Rodando servidor.
app.listen(process.env.API_PORT, () => {
    console.log(`The server is running in ${process.env.API_URL_BASE}:${process.env.API_PORT}`)
    console.log(`Access the API docs in ${process.env.API_URL_BASE}:${process.env.API_PORT}/docs`)
})
