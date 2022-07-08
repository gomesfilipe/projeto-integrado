const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Product')
require('../models/Store')
require('../models/Sale')
require('../models/Item')
const Store = mongoose.model('stores')
const Product = mongoose.model('products')
const Sale = mongoose.model('sales')
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
 * /sale/api/all:
 *      get:
 *          summary: Busca de todas as vendas de todas as lojas cadastradas.
 *          description: Rota para consultar todas as vendas efetuadas.
 *                       É necessário estar logado para acessá-la.
 *          tags: [Sale]
 *          security:
 *            - Bearer: []
 * 
 *          responses: 
 *              '200': 
 *                  description: Produtos consultados com sucesso!
 *              '400':
 *                  description: Erro ao consultar produtos no banco de dados.
 *              '401':
 *                  description: Token inválido.
 */
router.get('/api/all', (req, res) => {
    Sale.find()
        .then(sales => res.status(200).json({sales}))
        .catch(err => res.status(400).json({ message: 'Erro ao buscar vendas.' }))
})

/**
 * @swagger
 * /sale/api/dates/{from_date}/{to_date}:
 *      get:
 *          summary: Busca de vendas por data.
 *          description: Rota para consultar as vendas por período. As datas devem estar no formato YYYY-MM-DD.
 *                       É necessário estar logado para acessá-la.
 *          tags: [Sale]
 *          security:
 *            - Bearer: []
 *          
 *          parameters:
 *          - in: path
 *            name: from_date
 *            type: string
 *            required: true     
 * 
 *          - in: path
 *            name: to_date
 *            type: string
 *            required: true     
 * 
 *          responses: 
 *              '200': 
 *                  description: Produtos consultados com sucesso!
 *              '400':
 *                  description: Erro ao consultar produtos no banco de dados.
 *              '401':
 *                  description: Token inválido.
 */
router.get('/api/dates/:from_date/:to_date', (req, res) => {
    if(!req.params.from_date || !req.params.to_date)
        return res.json({ message: 'Faltam dados.' })

    // Formato YYYY-MM-DD HH:mm:ss
    const from_date = new Date(`${req.params.from_date} 00:00:00`)
    const to_date = new Date(`${req.params.to_date} 00:00:00`)

    if(from_date == 'Invalid Date') {
        return res.json({ message: 'Data inicial inválida.' })
    }

    if(to_date == 'Invalid Date') {
        return res.json({ message: 'Data final inválida.' })
    }

    Sale.find({"date": {
        "$gte": from_date.toISOString(), // Início do período. Obs: devem estar no formato ISO.
        "$lt": to_date.toISOString() // Fim do período. Exemplo: "2022-06-12T14:49:01.686Z"
    }, id_store: req.store_id})
        .then(sales => res.status(200).json({sales}))
        .catch(err => res.status(400).json({ message: 'Erro ao buscar vendas.' }))
})

/**
 * @swagger
 * /sale/api/:
 *      post:
 *          summary: Cadastro de venda.
 *          description: Rota para efetuar as vendas da loja.
 *                       É necessário estar logado para acessá-la.
 *          tags: [Sale]
 *          security:
 *            - Bearer: []
 *          parameters:
 *          - in: body
 *            name: product
 *            schema:
 *              type: object
 *              properties:
 *                items:
 *                  type: array
 *                  items:
 *                      type: string
 *                      example: 62c34b928340ed2117560766
 *                value:
 *                  type: string
 *                  example: 120.00
 * 
 *          responses: 
 *              '200': 
 *                  description: Venda efetuada com sucesso!
 *              '400':
 *                  description: Erro ao cadastrar venda no banco de dados, ou faltam dados, ou dados foram enviados de modo incorreto.
 *              '401':
 *                  description: Token inválido.
 */
router.post('/api', (req, res) => {
    if(!req.body.items || !req.body.value /*|| !req.body.id_store*/)
        return res.status(400).json({ message: 'Faltam dados.' })
    
    if(isNaN(req.body.value))
        return res.status(400).json({ message: 'Há dados inválidos.'})


    const sale = new Sale({
        items: req.body.items,
        value: req.body.value,
        id_store: req.store_id
        // id_store: req.body.id_store
    })

    sale.save()
        .then(() => {
            Store.findOne({_id: req.store_id/*req.body.id_store*/})
                .then(store => {
                    store.sales.push(sale)
                    store.save()
                        .then(() => res.status(200).json({ message: 'Venda concluída com sucesso!' }))
                        .catch(err => res.status(400).json({ message: 'Erro ao concluir venda.' }))
                })
                .catch(err => res.status(400).json({ message: 'Erro ao concluir venda.' }))
        })
        .catch(err => res.status(400).json({ message: 'Erro ao concluir venda1.' }))
})

/**
 * @swagger
 * /sale/api/{id}:
 *      delete:
 *          summary: Exclusão de venda por id.
 *          description: Rota para deletar uma venda específica por id.
 *                       É necessário estar logado para acessá-la.
 *          tags: [Sale]
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
 *                  description: Produto deletado com sucesso!
 *              '400':
 *                  description: Erro ao deletar venda no banco de dados ou venda não encontrada.
 *              '401':
 *                  description: Token inválido.
 */
router.delete('/api/:id', (req, res) => {
    const sale_id = req.params.id

    Sale.findOne({_id: sale_id})
        .then(sale => {
            if(!sale) {
                return res.status(400).json({ message: 'Venda inexistente.' })
            } else {
                Sale.deleteOne({_id: sale_id})
                    .then(() => res.status(200).json({ message: 'Venda deletada com sucesso!' }))
                    .catch(err => res.status(400).json({ message: 'Erro ao deletar venda.' }))
            }
        })
        .catch(err => res.status(400).json({ message: 'Erro ao deletar venda.' }))
})

module.exports = router
