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
router.get('/api/all', async (req, res) => {
    try {
        const sales = await Sale.find()
        return res.status(200).json({ sales })
    } catch(err) {
        return res.status(400).json({ message: 'Erro ao buscar vendas.' })
    }
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
router.get('/api', auth_middleware, async (req, res) => {
    try {
        const store_id = req.store_id
        const sales = await Sale.find({ id_store: store_id })
        return res.status(200).json({ sales })
    } catch(err) {
        return res.status(400).json({ message: 'Erro ao buscar vendas.' })
    }
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
router.get('/api/dates/:from_date/:to_date', auth_middleware, async (req, res) => {
    try {
        const store_id = req.store_id

        if(!req.params.from_date || !req.params.to_date)
            return res.status(400).json({ message: 'Faltam dados.' })
    
        // Formato YYYY-MM-DD HH:mm:ss
        const from_date = new Date(`${req.params.from_date} 00:00:00`)
        const to_date = new Date(`${req.params.to_date} 00:00:00`)
    
        if(from_date == 'Invalid Date') {
            return res.status(400).json({ message: 'Data inicial inválida.' })
        }
    
        if(to_date == 'Invalid Date') {
            return res.status(400).json({ message: 'Data final inválida.' })
        }

        const sales = await Sale.find({
            "date": {
                "$gte": from_date.toISOString(), // Início do período. Obs: devem estar no formato ISO.
                "$lt": to_date.toISOString() // Fim do período. Exemplo: "2022-06-12T14:49:01.686Z"
            }, 
            id_store: store_id
        })
        
        return res.status(200).json({ sales })
    } catch(err) {
        return res.status(400).json({ message: 'Erro ao buscar vendas.' })
    }
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
    try {
        if(!req.body.items || !req.body.value /*|| !req.body.id_store*/)
            return res.status(400).json({ message: 'Faltam dados.' })
        
        if(isNaN(req.body.value) || req.body.value < 0)
            return res.status(400).json({ message: 'Há dados inválidos.'})
    
        if(req.body.items.length == 0) 
            return res.status(400).json({ message: 'A venda deve ter pelo menos um item.'})
    
        for(let i = 0; i < req.body.items.length; i++) { // Verificando se há estoque para todos os itens.
            if(!req.body.items[i].quantity || !req.body.items[i].id_product) {
                return res.status(400).json({ message: 'Faltam dados.'})
            }
    
            let product = await Product.findOne({_id: req.body.items[i].id_product})
            
            if(!product) {
                return res.status(400).json({ message: 'Id inválido de um dos produtos.' })
            }
    
            if(req.body.items[i].quantity > product.quantity  || req.body.items[i].quantity <= 0 || isNaN(req.body.items[i].quantity)) {
                return res.status(400).json({ message: 'Quantidade inválida de um dos produtos.'})
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
            items: items_id,
            value: req.body.value,
            id_store: req.store_id
        })

        const store_id = req.store_id
        const new_sale = await sale.save()

        let store = await Store.findOne({ _id: store_id })
        store.sales.push(new_sale)
        await store.save()

        return res.status(200).json({
            new_sale,
            message: 'Venda concluída com sucesso!'
        })

    } catch(err) {
        return res.status(400).json({ message: 'Erro ao concluir venda.' })
    }
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
router.delete('/api/:id', auth_middleware, async (req, res) => {
    try {
        const sale_id = req.params.id
        const sale = await Sale.findOne({ _id: sale_id })

        if(!sale) {
            return res.status(400).json({ message: 'Venda inexistente.' })
        }

        for(let i = 0; i < sale.items.length; i++) { // Deletando os itens da venda no banco de dados.
            await Item.deleteOne({ _id: sale.items[i] })
        }

        let store = await Store.findOne({ _id: sale.id_store })
        const index = store.sales.indexOf(sale_id)

        if(index > -1) { // Retirando venda da lista de vendas da loja.
            store.sales.splice(index, 1)
        }

        await store.save()
        await Sale.deleteOne({ _id: sale_id })
        return res.status(200).json({ message: 'Venda deletada com sucesso!' })
    } catch(err) {
        return res.status(400).json({ message: 'Erro ao deletar venda.' })
    }
})

/**
 * @swagger
 * /sale/api/dashboards/{from_date}/{to_date}:
 *      get:
 *          summary: Consulta de faturamento e quantidade de vendas por data.
 *          description: Rota para consultar faturamento e quantidade de vendas num período da loja que está logada. As datas devem estar no formato YYYY-MM-DD.
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
 *                  description: Dashboards consultados com sucesso!
 *                  schema:
 *                    type: object
 *                    properties:
 *                      sales_quantity:
 *                        type: number
 *                        example: 110
 *                      sales_billing:
 *                        type: number
 *                        example: 15350.90
 *              '400':
 *                  description: Erro ao consultar vendas no banco de dados ou alguma das datas inválida.
 *                  schema:
 *                    $ref: '#/definitions/Error'
 *              '401':
 *                  description: Token inválido.
 *                  schema:
 *                    $ref: '#/definitions/ErrorToken'
 */
router.get('/api/dashboards/:from_date/:to_date', auth_middleware, async (req, res) => {
    try {
        if(!req.params.from_date || !req.params.to_date)
            return res.status(400).json({ message: 'Faltam dados.' })

        // Formato YYYY-MM-DD HH:mm:ss
        const from_date = new Date(`${req.params.from_date} 00:00:00`)
        const to_date = new Date(`${req.params.to_date} 00:00:00`)

        if(from_date == 'Invalid Date') {
            return res.status(400).json({ message: 'Data inicial inválida.' })
        }

        if(to_date == 'Invalid Date') {
            return res.status(400).json({ message: 'Data final inválida.' })
        }
        
        const store_id = req.store_id
        const sales = await Sale.find({ 
            "date": {
                "$gte": from_date.toISOString(), // Início do período. Obs: devem estar no formato ISO.
                "$lt": to_date.toISOString() // Fim do período. Exemplo: "2022-06-12T14:49:01.686Z"
            },

            id_store: store_id
        })

        const sales_quantity = sales.length
        let sales_billing = 0

        for(let sale of sales) {
            sales_billing += sale.value
        }

        return res.status(200).json({
            sales_quantity, 
            sales_billing
        })

    } catch(err) {
        return res.status(400).json({ message: 'Erro ao buscar vendas.' })
    }
})

module.exports = router
