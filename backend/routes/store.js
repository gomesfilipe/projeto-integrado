const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Store')
require('../models/Product')
const Store = mongoose.model('stores')
const Product = mongoose.model('products')
const auth_middleware = require('../middlewares/auth')

router.use(auth_middleware) // Middleware atuará nas rotas desse grupo.

/**
 * @swagger
 * securityDefinitions:
 *     Bearer:
 *       description: Efetue login para obter o token de autenticação.
 *       type: apiKey
 *       name: Authorization
 *       in: header
 */

/**
 * @swagger
 * /store/api:
 *      get:
 *          summary: Busca de todas as lojas.
 *          description: Rota para consultar todas as lojas cadastradas.
 *                       É necessário estar logado para acessá-la.
 *          tags: [Store]
 *          security:
 *            - Bearer: []
 * 
 *          responses: 
 *              '200': 
 *                  description: Lojas consultadas com sucesso!
 *              '400':
 *                  description: Erro ao consultar lojas no banco de dados.
 *              '401':
 *                  description: Token inválido.
 */
router.get('/api', (req, res) => {
    Store.find()
        .then(stores => res.status(200).json({stores}))
        .catch(err => res.status(400).json({ message: 'Erro ao buscar lojas.' }))
})

/**
 * @swagger
 * /store/api/{id}:
 *      get:
 *          summary: Busca de loja por id.
 *          description: Rota para consultar uma loja específica por id.
 *                       É necessário estar logado para acessá-la.
 *          tags: [Store]
 *          security:
 *            - Bearer: []
 *          
 *          parameters:
 *          - in: path
 *            name: id
 *            type: string
 *            required: true
 * 
 *          responses: 
 *              '200': 
 *                  description: Loja consultada com sucesso!
 *              '400':
 *                  description: Erro ao consultar loja no banco de dados ou loja não encontrada.
 *              '401':
 *                  description: Token inválido.
 */
router.get('/api/:id', (req, res) => {
    const store_id = req.params.id

    Store.findOne({_id: store_id})
        .then(store => {
            if(!store) {
                return res.status(400).json({ message: 'Loja não encontrada.' })
            } else {
                res.status(200).json({store})
            }
        })
        .catch(() => {return res.status(400).json({ message: 'Loja não encontrada.' })})
})

/**
 * @swagger
 * /store/api/{id}:
 *      put:
 *          summary: Edição de loja por id.
 *          description: Rota para editar informações de uma loja específica por id.
 *                       É necessário estar logado para acessá-la.
 *          tags: [Store]
 *          security:
 *            - Bearer: []
 *          
 *          parameters:
 *          - in: path
 *            name: id
 *            type: string
 *            required: true
 *          
 *          - in: body
 *            name: store
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  example: Loja
 *                username:
 *                  type: string
 *                  example: loja123
 *                password:
 *                  type: string
 *                  example: 123456
 *                admin_password:
 *                  type: string
 *                  example: 123456admin
 * 
 *          responses: 
 *              '200': 
 *                  description: Loja editada com sucesso!
 *              '400':
 *                  description: Erro ao editar loja no banco de dados ou loja não encontrada.
 *              '401':
 *                  description: Token inválido.
 */
router.put('/api/:id', (req, res) => {
    const store_id = req.params.id

    if(!req.body.name || !req.body.username || !req.body.password || !req.body.admin_password)
        return res.status(400).json({ message: 'Faltam dados.' })

    //! Validar username, password e admin_password (definir critérios).

    Store.findOne({_id: store_id})
        .then(store => {
            if(!store) {
                return res.status(400).json({ message: 'Loja não encontrada.' })
            } else {
                store.name = req.body.name,
                store.username = req.body.username,
                store.password = req.body.password,
                store.admin_password = req.body.admin_password

                store.save()
                    .then(() => res.json({ message: 'Loja editada com sucesso!' }))
                    .catch(err => res.status(400).json({ message: 'Erro ao editar loja.' }))
            }
        })
        .catch(err => res.status(400).json({ message: 'Erro ao editar loja.' }))
})

/**
 * @swagger
 * /store/api/{id}:
 *      delete:
 *          summary: Remoção de loja por id.
 *          description: Rota para excluir uma loja específica por id.
 *                       É necessário estar logado para acessá-la.
 *          tags: [Store]
 *          security:
 *            - Bearer: []
 *          
 *          parameters:
 *          - in: path
 *            name: id
 *            type: string
 *            required: true
 * 
 *          responses: 
 *              '200': 
 *                  description: Loja deletada com sucesso!
 *              '400':
 *                  description: Erro ao deletar loja no banco de dados ou loja não encontrada.
 *              '401':
 *                  description: Token inválido.
 */
router.delete('/api/:id', (req, res) => {
    const store_id = req.params.id

    Store.findOne({_id: store_id})
        .then(store => {
            if(!store) {
                return res.status(400).json({ message: 'Loja inexistente.' })
            } else {
                Store.deleteOne({_id: store_id})
                    .then(() => {
                        res.status(200).json({ message: 'Loja deletada com sucesso!' })
                    })
                    .catch(err => res.status(400).json({ message: 'Erro ao deletar loja.' }))
            }
        })
        .catch(err => {
            return res.status(400).json({ message: 'Erro ao deletar loja.' })
        })
})

module.exports = router
