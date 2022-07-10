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
 *   CompleteSale:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *         example: 62c49c5bc163eea36e8756c8
 *       items:
 *         type: array
 *         items:
 *           type: string
 *           example: 62c34b928340ed2117560766
 *       date: 
 *         type: string
 *         example: 2022-07-05T20:16:31.417Z
 *       value:
 *         type: number
 *         example: 120.5
 *       id_store:
 *         type: string
 *         example: 62c2440e7e340b831c3ab807
 *       __v:
 *         type: number
 *         example: 0
 *
 *   Sale:
 *     type: object
 *     properties:
 *       items:
 *         type: array
 *         items:
 *           type: object
 *           properties:
 *             id_product:
 *               type: string
 *               example: 62c34b928340ed2117560766
 *             quantity:
 *               type: string
 *               example: 5
 *       value:
 *         type: string
 *         example: 125.5
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
 * 
 *   Success:
 *     type: object
 *     properties:
 *       message:
 *         type: string
 *         example: success message
 */

/**
 * @swagger
 * /sale/api/all:
 *      get:
 *          summary: Busca de todas as vendas de todas as lojas cadastradas.
 *          description: Rota para consultar todas as vendas efetuadas de todas as lojas cadastradas.
 *                       Não necessário autenticação para acessá-la.
 *          tags: [Sale]
 * 
 *          responses: 
 *              '200': 
 *                  description: Vendas consultadoa com sucesso!
 *                  schema:
 *                    type: object
 *                    properties:
 *                      sales:
 *                        type: array
 *                        items:
 *                          $ref: '#/definitions/CompleteSale'
 *                          
 *              '400':
 *                  description: Erro ao consultar vendas no banco de dados.
 *                  schema:
 *                    $ref: '#/definitions/Error'
 *              '401':
 *                  description: Token inválido.
 *                  schema:
 *                    $ref: '#/definitions/ErrorToken'
 */
router.get('/api/all', (req, res) => {
    Sale.find()
        .then(sales => res.status(200).json({sales}))
        .catch(err => res.status(400).json({ message: 'Erro ao buscar vendas.' }))
})

/**
 * @swagger
 * /sale/api:
 *      get:
 *          summary: Busca de todas as vendas da loja que está logada.
 *          description: Rota para consultar todas as vendas efetuadas pela loja logada.
 *                       É necessário autenticação para acessá-la.
 *          tags: [Sale]
 *          security:
 *            - Bearer: []
 * 
 *          responses: 
 *              '200': 
 *                  description: Vendas consultadas com sucesso!
 *                  schema:
 *                    type: object
 *                    properties:
 *                      sales:
 *                        type: array
 *                        items:
 *                          $ref: '#/definitions/CompleteSale'
 *              '400':
 *                  description: Erro ao consultar vendas no banco de dados.
 *                  schema:
 *                    $ref: '#/definitions/Error'
 *              '401':
 *                  description: Token inválido.
 *                  schema:
 *                    $ref: '#/definitions/ErrorToken'
 */
router.get('/api', auth_middleware, (req, res) => {
    Sale.find({id_store: req.store_id})
        .then(sales => res.status(200).json({sales}))
        .catch(err => res.status(400).json({ message: 'Erro ao buscar vendas.' }))
})

/**
 * @swagger
 * /sale/api/dates/{from_date}/{to_date}:
 *      get:
 *          summary: Busca de vendas por data.
 *          description: Rota para consultar as vendas por período. As datas devem estar no formato YYYY-MM-DD.
 *                       É necessário autenticação para acessá-la.
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
 *                  description: Vendas consultadas com sucesso!
 *                  schema:
 *                    type: object
 *                    properties:
 *                      sales:
 *                        type: array
 *                        items:
 *                          $ref: '#/definitions/CompleteSale'
 *              '400':
 *                  description: Erro ao consultar vendas no banco de dados ou alguma das datas inválida.
 *                  schema:
 *                    $ref: '#/definitions/Error'
 *              '401':
 *                  description: Token inválido.
 *                  schema:
 *                    $ref: '#/definitions/ErrorToken'
 */
router.get('/api/dates/:from_date/:to_date', auth_middleware, (req, res) => {
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
 *          description: Rota para efetuar as vendas da loja. Devem ser passados no corpo da requisição 
 *                       os itens e o valor da venda.
 *                       É necessário autenticação para acessá-la.
 *          tags: [Sale]
 *          security:
 *            - Bearer: []
 * 
 *          parameters:
 *          - in: body
 *            name: sale
 *            schema:
 *              $ref: '#/definitions/Sale'
 * 
 *          responses: 
 *              '200': 
 *                  description: Venda efetuada com sucesso!
 *                  schema:
 *                    type: object
 *                    properties:
 *                      new_sale:
 *                        $ref: '#/definitions/CompleteSale'
 *                      message:
 *                        type: string
 *                        example: success message
 *                          
 *              '400':
 *                  description: Erro ao cadastrar venda no banco de dados, ou faltam dados, ou dados foram enviados de modo incorreto.
 *                  schema:
 *                    $ref: '#/definitions/Error'
 *              '401':
 *                  description: Token inválido.
 *                  schema:
 *                    $ref: '#/definitions/ErrorToken'
 */
router.post('/api', auth_middleware, async (req, res) => {
    if(!req.body.items || !req.body.value /*|| !req.body.id_store*/)
        return res.status(400).json({ message: 'Faltam dados.' })
    
    if(isNaN(req.body.value))
        return res.status(400).json({ message: 'Há dados inválidos.'})

    for(let i = 0; i < req.body.items.length; i++) { // Verificando se há estoque para todos os itens.
        let product = await Product.findOne({_id: req.body.items[i].id_product})
        
        if(!product) {
            return res.status(400).json({ message: 'Id inválido de um dos produtos.' })
        }

        if(req.body.items[i].quantity > product.quantity  || req.body.items[i].quantity <= 0) {
            return res.status(400).json({ message: 'Quantidade  inválida de um dos produtos.'})
        }
    }

    let items_id = []

    for(let i = 0; i < req.body.items.length; i++) { // Salvando itens no banco de dados.
        let item = new Item({
            id_product: req.body.items[i].id_product,
            id_store: req.store_id,
            quantity: Number(req.body.items[i].quantity)
        })

        let product = await Product.findOne({_id: item.id_product})

        product.quantity -= item.quantity // Descontando o estoque do produto relacionado ao item.
        await product.save()

        let save_item = await item.save()
        items_id.push(save_item._id)
    }

    const sale = new Sale({
        // items: req.body.items,
        items: items_id,
        value: req.body.value,
        id_store: req.store_id
        // id_store: req.body.id_store
    })

    sale.save()
        .then((new_sale) => {
            Store.findOne({_id: req.store_id/*req.body.id_store*/})
                .then(store => {
                    store.sales.push(sale)
                    store.save()
                        .then(() => res.status(200).json({ 
                            new_sale,
                            message: 'Venda concluída com sucesso!' 
                        }))
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
 *          description: Rota para deletar uma venda específica por id da loja que está logada.
 *                       É necessário autenticação para acessá-la.
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
 *                  description: Venda deletada com sucesso!
 *                  schema:
 *                    $ref: '#/definitions/Success'
 *              '400':
 *                  description: Erro ao deletar venda no banco de dados ou venda não encontrada.
 *                  schema:
 *                    $ref: '#/definitions/Error'
 *              '401':
 *                  description: Token inválido.
 *                  schema:
 *                    $ref: '#/definitions/ErrorToken'
 */
router.delete('/api/:id', auth_middleware, (req, res) => {
    const sale_id = req.params.id

    Sale.findOne({_id: sale_id})
        .then(async sale => {
            if(!sale) {
                return res.status(400).json({ message: 'Venda inexistente.' })
            } else {
                for(let i = 0; i < sale.items.length; i++) { // Deletando os itens da venda no banco de dados.
                    await Item.deleteOne({_id: sale.items[i]})
                }
                
                let store = await Store.findOne({_id: sale.id_store})
                const index = store.sales.indexOf(sale_id)
                
                if(index > -1) { // Retirando venda da lista de vendas da loja.
                    store.sales.splice(index, 1)
                }

                await store.save()
                
                Sale.deleteOne({_id: sale_id})
                    .then(() => res.status(200).json({ message: 'Venda deletada com sucesso!' }))
                    .catch(err => res.status(400).json({ message: 'Erro ao deletar venda.' }))
            }
        })
        .catch(err => res.status(400).json({ message: 'Erro ao deletar venda.' }))
})

module.exports = router
