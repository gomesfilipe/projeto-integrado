const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Product')
require('../models/Store')
const Product = mongoose.model('products')
const Store = mongoose.model('stores')
const Item = mongoose.model('items')

const auth_middleware = require('../middlewares/auth')

// router.use(auth_middleware) // Middleware atuará nas rotas desse grupo.

/**
 * @swagger
 * securityDefinitions:
 *     Bearer:
 *       description: Efetue login para obter o token de autenticação.
 *       type: apiKey
 *       name: Authorization
 *       in: header
 * 
 * definitions:
 * 
 */

/**
 * @swagger
 * /item/api/all:
 *      get:
 *          summary: Busca de todos os itens de todas as lojas cadastradas.
 *          description: Rota para consultar todos os itens cadastrados.
 *                       Não é necessário autenticação para acessá-la.
 *          tags: [Item]
 * 
 *          responses: 
 *              '200': 
 *                  description: Itens consultados com sucesso!
 *              '400':
 *                  description: Erro ao consultar itens no banco de dados.
 *              '401':
 *                  description: Token inválido.
 */
router.get('/api/all', (req, res) => {
    Item.find()
        .then(items => res.status(200).json({ items }))
        .catch(err => res.status(400).json({ message: 'Erro ao buscar itens.' }))
})

/**
 * @swagger
 * /item/api:
 *      get:
 *          summary: Busca de todos os itens da loja que está logada.
 *          description: Rota para consultar todos os itens cadastrados.
 *                       É necessário estar logado para acessá-la.
 *          tags: [Item]
 *          security:
 *            - Bearer: []
 * 
 *          responses: 
 *              '200': 
 *                  description: Itens consultados com sucesso!
 *              '400':
 *                  description: Erro ao consultar itens no banco de dados.
 *              '401':
 *                  description: Token inválido.
 */
router.get('/api', auth_middleware, (req, res) => {
    Item.find({id_store: req.store_id})
        .then(items => res.status(200).json({ items }))
        .catch(err => res.status(400).json({ message: 'Erro ao buscar itens.' }))
})

module.exports = router
