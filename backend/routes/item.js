const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Product')
require('../models/Store')
const Product = mongoose.model('products')
const Store = mongoose.model('stores')
const Item = mongoose.model('items')

const auth_middleware = require('../middlewares/auth')

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
 *   Item:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *         example: 62c34b928340ed2117560766
 *       id_product:
 *         type: string
 *         example: 62c339f67ef69ce43d463525
 *       id_store:
 *         type: string
 *         example: 62c2440e7e340b831c3ab807
 *       id_quantity:
 *         type: number
 *         example: 4
 *       __v:
 *         type: number
 *         example: 0
 * 
 *   Error:
 *     type: object
 *     properties:
 *       message:
 *         type: string
 *         example: error message
 *
 *   ErrorToken:
 *     type: object
 *     properties:
 *       err:
 *         type: string
 *         example: error token message
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
 *                  schema:
 *                    type: object
 *                    properties:
 *                      items:
 *                        type: array
 *                        items:
 *                          $ref: '#/definitions/Item'
 *              '400':
 *                  description: Erro ao consultar itens no banco de dados.
 *                  schema:
 *                    $ref: '#/definitions/Error'
 * 
 *              '401':
 *                  description: Token inválido.
 *                  schema:
 *                    $ref: '#/definitions/ErrorToken'
 */
router.get('/api/all', async (req, res) => {
    try {
        const items = await Item.find()
        return res.status(200).json({ items })
    } catch(err) {
        return res.status(400).json({ message: 'Erro ao buscar itens.' })
    }
})

/**
 * @swagger
 * /item/api:
 *      get:
 *          summary: Busca de todos os itens da loja que está logada.
 *          description: Rota para consultar todos os itens cadastrados da loja que está logada.
 *                       É necessário estar logado para acessá-la.
 *          tags: [Item]
 *          security:
 *            - Bearer: []
 * 
 *          responses: 
 *              '200': 
 *                  description: Itens consultados com sucesso!
 *                  schema:
 *                    type: object
 *                    properties:
 *                      items:
 *                        type: array
 *                        items:
 *                          $ref: '#/definitions/Item'
 *              '400':
 *                  description: Erro ao consultar itens no banco de dados.
 *                  schema:
 *                    $ref: '#/definitions/Error'
 *              '401':
 *                  description: Token inválido.
 *                  schema:
 *                    $ref: '#/definitions/ErrorToken'
 */
router.get('/api', auth_middleware, async (req, res) => {
    try {
        const store_id = req.store_id
        const items = await Item.find({ id_store: store_id})
        return res.status(200).json({ items })
    } catch(err) {
        return res.status(400).json({ message: 'Erro ao buscar itens.' })
    }
})

module.exports = router
