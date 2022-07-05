const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Product')
require('../models/Store')
const Product = mongoose.model('products')
const Store = mongoose.model('stores')
const Item = mongoose.model('items')

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
 * /item/api:
 *      get:
 *          summary: Busca de todos os itens de todas as lojas cadastradas.
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
router.get('/api', (req, res) => {
    Item.find()
        .then(items => res.status(200).json({ items }))
        .catch(err => res.status(400).json({ message: 'Erro ao buscar itens.' }))
})

/**
 * @swagger
 * /item/api:
 *      post:
 *          summary: Cadastro de item.
 *          description: Rota para efetuar cadastro de item, devendo ser informados
 *                       id do produto, quantidade e id de sua loja.
 *                       É necessário estar logado para acessá-la.
 *          tags: [Item]
 *          security:
 *            - Bearer: []
 *          parameters:
 *          - in: body
 *            name: item
 *            schema:
 *              type: object
 *              properties:
 *                id_product:
 *                  type: string
 *                  example: 62c339f67ef69ce43d463525
 *                quantity:
 *                  type: string
 *                  example: 3
 * 
 *          responses: 
 *              '200': 
 *                  description: Item cadastrado com sucesso!
 *              '400':
 *                  description: Erro ao cadastrar item. (Faltaram dados no corpo da requisição,
 *                               ou ocorreu falha ao salvar no banco de dados ou 
 *                               dados foram passados de modo incorreto)
 *              '401':
 *                  description: Token inválido.
 */
router.post('/api', (req, res) => {
    if(!req.body.id_product || /*!req.body.id_store ||*/ !req.body.quantity)
        return res.status(400).json({ message: 'Faltam dados.' })
    
    if(isNaN(req.body.quantity))
        return res.status(400).json({ message: 'Há dados inválidos.'})
        
    const item = new Item({
        id_product: req.body.id_product,
        id_store: req.store_id, // Campo store_id da requisição vem do middleware de autenticação.
        // id_store: req.body.id_store,
        quantity: Number(req.body.quantity)
    })

    item.save()
        .then(() => res.status(200).json({ message: 'Item criado com sucesso!' }))
        .catch(err => res.status(400).json({ message: 'Erro ao criar item.' }))
})

/**
 * @swagger
 * /item/api/{id}:
 *      delete:
 *          summary: Exclusão de item por id.
 *          description: Rota para deletar item por id.
 *                       É necessário estar logado para acessá-la.
 *          tags: [Item]
 *          security:
 *            - Bearer: []
 *          parameters:
 *          - in: path
 *            name: id
 *            type: string
 *            required: true
 * 
 *          responses: 
 *              '200': 
 *                  description: Item deletado com sucesso!
 *              '400':
 *                  description: Erro ao deletar item no banco de dados ou item não existe.
 *              '401':
 *                  description: Token inválido.
 */
router.delete('/api/:id', (req, res) => {
    const item_id = req.params.id

    Item.findOne({_id: item_id})
        .then(item => {
            if(!item) {
                return res.status(400).json({ message: 'Item inexistente.' })
            } else {
                Item.deleteOne({id: item_id})
                    .then(() => res.status(200).json({ message: 'Item deletado com sucesso!' }))
                    .catch(err => res.status(400).json({ message: 'Erro ao deletar item.' }))
            }
        })
        .catch(err => res.status(400).json({ message: 'Erro ao deletar item.' }))
})

module.exports = router
