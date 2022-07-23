const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Product')
require('../models/Store')
const Product = mongoose.model('products')
const Store = mongoose.model('stores')

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
 *   Product:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *         example: Prego
 *       cost:
 *         type: string
 *         example: 25.5
 *       sale:
 *         type: string
 *         example: 42.5
 *       quantity:
 *         type: string
 *         example: 20
 *       unity:
 *         type: string
 *         example: KG
 *       min:
 *         type: string
 *         example: 3
 * 
 *   CompleteProduct:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *         example: 62c339f67ef69ce43d463525
 *       name:
 *         type: string
 *         example: Prego
 *       cost:
 *         type: number
 *         example: 25.5
 *       sale:
 *         type: number
 *         example: 42.5
 *       quantity:
 *         type: number
 *         example: 20
 *       unity:
 *         type: string
 *         example: KG
 *       id_store:
 *         type: string
 *         example: 62c2440e7e340b831c3ab807
 *       min:
 *         type: number
 *         example: 3
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
 * /product/api/all:
 *      get:
 *          summary: Busca de todos os produtos de todas as lojas cadastradas.
 *          description: Rota para consultar todos os produtos cadastrados de todas as lojas cadastradas.
 *                       Não é necessário autenticação para acessá-la.
 *          tags: [Product]
 * 
 *          responses: 
 *              '200': 
 *                  description: Produtos consultados com sucesso!
 *                  schema:
 *                    type: object
 *                    properties:
 *                      products:
 *                        type: array
 *                        items:
 *                          $ref: '#/definitions/CompleteProduct'
 *              '400':
 *                  description: Erro ao consultar produtos no banco de dados.
 *                  schema:
 *                    $ref: '#/definitions/Error'
 *              '401':
 *                  description: Token inválido.
 *                  schema:
 *                    $ref: '#/definitions/ErrorToken'
 */
router.get('/api/all', async (req, res) => {
    try {
        const products = await Product.find()
        return res.status(200).json({ products })
    } catch(err) {
        return res.status(400).json({ message: 'Erro ao buscar produtos.' })
    }
})

/**
 * @swagger
 * /product/api:
 *      get:
 *          summary: Busca de todos os produtos da loja que está logada.
 *          description: Rota para consultar todos os produtos da loja que está logada.
 *                       É necessário autenticação para acessá-la.
 *          tags: [Product]
 *          security:
 *            - Bearer: []
 * 
 *          responses: 
 *              '200': 
 *                  description: Produtos consultados com sucesso!
 *                  schema:
 *                    type: object
 *                    properties:
 *                      products:
 *                        type: array
 *                        items:
 *                          $ref: '#/definitions/CompleteProduct'
 *              '400':
 *                  description: Erro ao consultar produto no banco de dados ou produtos não encontrados.
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
        const products = await Product.find({ id_store: store_id })

        if(!products) {
            return res.status(400).json({ message: 'Produto não encontrado.' })
        }

        return res.status(200).json({ products })
    } catch(err) {
        return res.status(400).json({ message: 'Erro ao buscar produtos.' })
    }
})

/**
 * @swagger
 * /product/api/{page}/{size_page}:
 *      get:
 *          summary: Busca de todos produtos da loja que está logada com paginação.
 *          description: Rota para consultar produtos em geral da loja que está logada.
 *                       Deve-se passar no path da requisição o número e tamanho da página de produtos.
 *                       É necessário autenticação para acessar esta rota.
 *          tags: [Product]
 *          security:
 *            - Bearer: []
 *          
 *          parameters:
 *          - in: path
 *            name: page
 *            type: string
 *            required: true
 *          - in: path
 *            name: size_page
 *            type: string
 *            required: true
 * 
 *          responses: 
 *              '200': 
 *                  description: Produtos consultados com sucesso!
 *                  schema:
 *                    type: object
 *                    properties:
 *                      products:
 *                        type: array
 *                        items:
 *                          $ref: '#/definitions/CompleteProduct'
 *              '400':
 *                  description: Erro ao consultar produto no banco de dados ou produto não encontrado ou faltam dados no corpo da requisição.
 *                  schema:
 *                    $ref: '#/definitions/Error'
 *              '401':
 *                  description: Token inválido.
 *                  schema:
 *                    $ref: '#/definitions/ErrorToken'
 */
router.get('/api/:page/:size_page', auth_middleware, async (req, res) => {
    try {
        const page = req.params.page
        const size_page = req.params.size_page
        const store_id = req.store_id

        if(!page || !size_page) {
            return res.status(400).json({ message: 'Faltam dados.' })
        }
    
        if(isNaN(page) || isNaN(size_page) || size_page <= 0) {
            return res.status(400).json({ message: 'Há dados inválidos.'})
        }

        const products = await Product.find({ id_store: store_id })
                                .skip(page > 0 ? ((page - 1) * size_page) : 0)
                                .limit(size_page)
        
        if(!products) {
            return res.status(400).json({ message: 'Produto não encontrado.' })
        }

        return res.status(200).json({ products })
    } catch(err) {
        return res.status(400).json({ message: 'Erro ao buscar produtos.' })
    }
})

/**
 * @swagger
 * /product/api/name/{name}/{page}/{size_page}:
 *      get:
 *          summary: Busca de produtos da loja que está logada por nome com paginação.
 *          description: Rota para consultar produtos da loja que está logada que contenham seu nome iniciado pelo parâmetro passado.
 *                       Deve-se passar no path da requisição o nome do produto, o número e tamanho da página de produtos.
 *                       É necessário autenticação para acessar esta rota.
 *          tags: [Product]
 *          security:
 *            - Bearer: []
 *          
 *          parameters:
 *          - in: path
 *            name: name
 *            type: string
 *            required: true
 *          - in: path
 *            name: page
 *            type: string
 *            required: true
 *          - in: path
 *            name: size_page
 *            type: string
 *            required: true
 * 
 *          responses: 
 *              '200': 
 *                  description: Produtos consultados com sucesso!
 *                  schema:
 *                    type: object
 *                    properties:
 *                      products:
 *                        type: array
 *                        items:
 *                          $ref: '#/definitions/CompleteProduct'
 *              '400':
 *                  description: Erro ao consultar produto no banco de dados ou produto não encontrado ou faltam dados no corpo da requisição.
 *                  schema:
 *                    $ref: '#/definitions/Error'
 *              '401':
 *                  description: Token inválido.
 *                  schema:
 *                    $ref: '#/definitions/ErrorToken'
 */
router.get('/api/name/:name/:page/:size_page', auth_middleware, async (req, res) => {
    try {
        const product_name = req.params.name
        const page = req.params.page
        const size_page = req.params.size_page
        const store_id = req.store_id

        if(!product_name || !page || !size_page) {
            return res.status(400).json({ message: 'Faltam dados.' })
        }
    
        if(isNaN(page) || isNaN(size_page) || size_page <= 0) {
            return res.status(400).json({ message: 'Há dados inválidos.'})
        }

        const products = await Product.find({
            name: {
                "$regex": `^(${product_name})`,
                "$options": "i" // Não diferencia letras maiúsculas de minúsculas.
            }, 
            id_store: store_id
        })
            .skip(page > 0 ? ((page - 1) * size_page) : 0)
            .limit(size_page)

        if(!products) {
            return res.status(400).json({ message: 'Produto não encontrado.' })
        }

        return res.status(200).json({ products })
    } catch(err) {
        return res.status(400).json({ message: 'Erro ao buscar produtos.' })
    }
})

/**
 * @swagger
 * /product/api/{name}:
 *      get:
 *          summary: Busca de produtos da loja que está logada por nome sem paginação.
 *          description: Rota para consultar produtos da loja que está logada por nome sem paginação.
 *                       É necessário autenticação para acessá-la.
 *          tags: [Product]
 *          security:
 *            - Bearer: []
 *          
 *          parameters:
 *          - in: path
 *            name: name
 *            type: string
 *            required: true
 * 
 *          responses: 
 *              '200': 
 *                  description: Produto consultado com sucesso!
 *                  schema:
 *                    type: object
 *                    properties:
 *                      products:
 *                        type: array
 *                        items:
 *                          $ref: '#/definitions/CompleteProduct'
 *              '400':
 *                  description: Erro ao consultar produto no banco de dados ou produto não encontrada.
 *                  schema:
 *                    $ref: '#/definitions/Error'
 *              '401':
 *                  description: Token inválido.
 *                  schema:
 *                    $ref: '#/definitions/ErrorToken'
 */
router.get('/api/:name', auth_middleware, async (req, res) => {
    try {
        const store_id = req.store_id
        const product_name = req.params.name

        if(!product_name) {
            return res.status(400).json({ message: 'Faltam dados.' })
        }

        const products = await Product.find({
            name: {
                "$regex": `^(${product_name})`,
                "$options": "i" // Não diferencia letras maiúsculas de minúsculas.
            },
            id_store: store_id
        })

        if(!products) {
            return res.status(400).json({ message: 'Produto não encontrado.' })
        }

        return res.status(200).json({ products })
    } catch(err) {
        return res.status(400).json({ message: 'Erro ao buscar produtos.' })
    }
})

/**
 * @swagger
 * /product/api:
 *      post:
 *          summary: Cadastro de produto.
 *          description: Rota para efetuar cadastro de produto, devendo ser informados
 *                       nome, preço de custo, preço de venda, quantidade, unidade e estoque mínimo.
 *                       É necessário autenticação para acessá-la.
 *          tags: [Product]
 *          security:
 *            - Bearer: []
 *          parameters:
 *          - in: body
 *            name: product
 *            schema:
 *              $ref: '#/definitions/Product'
 * 
 *          responses: 
 *              '200': 
 *                  description: Produto cadastrado com sucesso!
 *                  schema:
 *                    type: object
 *                    properties:
 *                      product:
 *                        $ref: '#/definitions/CompleteProduct'
 *                      message:
 *                        type: string
 *                        example: success message
 *              '400':
 *                  description: Erro ao cadastrar produto. (Faltaram dados no corpo da requisição,
 *                               ou o produto já existe, ou ocorreu falha ao salvar no banco de dados ou 
 *                               dados foram passados de modo incorreto)
 *                  schema:
 *                    $ref: '#/definitions/Error'
 *              '401':
 *                  description: Token inválido.
 *                  schema:
 *                    $ref: '#/definitions/ErrorToken'
 */
router.post('/api', auth_middleware, async (req, res) => {
    try {
        const name = req.body.name
        const cost = req.body.cost
        const sale = req.body.sale
        const quantity = req.body.quantity
        const unity = req.body.unity
        const min = req.body.min
        const store_id = req.store_id // Este campo da requisição vem do middleware de autenticação.
        
        if(!name || !cost || !sale || !quantity || !unity || !min)
            return res.status(400).json({ message: 'Faltam dados.' })
    
        if(isNaN(cost) || isNaN(sale) || isNaN(quantity) || isNaN(min))
            return res.status(400).json({ message: 'Há dados inválidos.' })
    
        if(cost < 0 || sale < 0 || quantity < 0 || min < 0) {
            return res.status(400).json({ message: 'Há valores negativos.' })
        }

        const product1 = await Product.findOne({
            name: name,
            id_store: store_id
        })

        if(product1) {
            return res.status(400).json({ message: 'Produto já existente.' })
        }

        const new_product = new Product({
            name: name,
            cost: Number(cost),
            sale: Number(sale),
            quantity: Number(quantity),
            // photo: req.body.photo,
            unity: unity,
            id_store: store_id,
            min: min
        })

        const product = await new_product.save()
        const store = await Store.findOne({ _id: store_id })
        store.products.push(product)
        await store.save()

        return res.status(200).json({
            product,
            message: 'Produto cadastrado e inserido na loja com sucesso!' 
        })
    } catch(err) {
        return res.status(400).json({ message: 'Erro ao cadastrar produto.' })
    }
})

/**
 * @swagger
 * /product/api/{id}:
 *      put:
 *          summary: Edição de produto.
 *          description: Rota para efetuar edição de produto, devendo ser informados no corpo da requisiçãp
 *                       nome, preço de custo, preço de venda, quantidade, unidade e estoque mínimo atualizados. 
 *                       No path deve ser passado o id do produto que se deseja editar.
 *                       É necessário autenticação para acessá-la.
 *          tags: [Product]
 *          security:
 *            - Bearer: []
 *          parameters:
 *          - in: path
 *            name: id
 *            type: string
 *            required: true
 *          - in: body
 *            name: product
 *            schema:
 *              $ref: '#/definitions/Product'
 * 
 *          responses: 
 *              '200': 
 *                  description: Produto editado com sucesso!
 *                  schema:
 *                    type: object
 *                    properties:
 *                      edited_product:
 *                        $ref: '#/definitions/CompleteProduct'
 *                      message:
 *                        type: string
 *                        example: success message
 *              '400':
 *                  description: Erro ao editar produto. (Faltaram dados no corpo da requisição,
 *                               ou o produto não existe, ou ocorreu falha ao salvar edição no banco de dados ou 
 *                               dados foram passados de modo incorreto).
 *                  schema:
 *                    $ref: '#/definitions/Error'
 *              '401':
 *                  description: Token inválido.
 *                  schema:
 *                    $ref: '#/definitions/ErrorToken'
 */
router.put('/api/:id', auth_middleware, async (req, res) => {
    try {
        const product_id = req.params.id
        const name = req.body.name
        const cost = req.body.cost
        const sale = req.body.sale
        const quantity = req.body.quantity
        const unity = req.body.unity
        const min = req.body.min
        const store_id = req.store_id
        
        if(!name || !cost || !sale || !quantity || /*!req.body.photo ||*/ !unity || !min)
        return res.status(400).json({ message: 'Faltam dados.' })
        
        if(isNaN(cost) || isNaN(sale) || isNaN(quantity) || isNaN(min))
        return res.status(400).json({ message: 'Há dados inválidos.'})
        
        if(cost < 0 || sale < 0 || quantity < 0 || min < 0) {
            return res.status(400).json({ message: 'Há valores negativos.' })
        }

        let product = await Product.findOne({ _id: product_id })

        if(!product) {
            return res.status(400).json({ message: 'Produto não encontrado.' })
        }

        if(name != product.name) { // Mudança de nome do produto, verificar se já existe ou não.
            const product2 = await Product.findOne({
                name: name,  
                id_store: store_id
            })

            if(product2) {
                return res.status(400).json({ message: 'Nome do produto já está em uso.'})
            }
        }

        product.name = name
        product.cost = Number(cost),
        product.sale = Number(sale),
        product.quantity = Number(quantity),
        // product.photo = req.body.photo,
        product.unity = unity
        product.min = Number(min)

        const edited_product = await product.save()

        return res.status(200).json({
            edited_product, 
            message: 'Produto editado com sucesso!'
        })
    } catch(err) {
        return res.status(400).json({ message: 'Erro ao editar produto.' })
    }
})

/**
 * @swagger
 * /product/api/{id}:
 *      delete:
 *          summary: Exclusão de produto por id.
 *          description: Rota para deletar um produto específico por id da loja que está logada.
 *                       O id do produto deve ser passado no path da requisição.
 *                       É necessário autenticação para acessá-la.
 *          tags: [Product]
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
 *                  schema:
 *                    $ref: '#/definitions/Success'
 *              '400':
 *                  description: Erro ao deletar produto no banco de dados ou produto não encontrado.
 *                  schema:
 *                    $ref: '#/definitions/Error'
 *              '401':
 *                  description: Token inválido.
 *                  schema:
 *                    $ref: '#/definitions/ErrorToken'
 */
router.delete('/api/:id', auth_middleware, async (req, res) => {
    try {
        const product_id = req.params.id
        const product = await Product.findOne({ _id: product_id })

        if(!product) {
            return res.status(400).json({ message: 'Produto inexistente.' })
        }

        let store = await Store.findOne({ _id: product.id_store })
        
        const index = store.products.indexOf(product_id)
        if(index > -1) {
            store.products.splice(index, 1) // Deletando produto da lista de produtos da loja.
        }

        await store.save()
        await Product.deleteOne({ _id: product_id })

        return res.status(200).json({ message: 'Produto deletado com sucesso!' })
    } catch(err) {
        return res.status(400).json({ message: 'Erro ao deletar produto.' })
    }
})

/**
 * @swagger
 * /product/api/less/than/min:
 *      get:
 *          summary: Busca de produtos abaixo do estoque mínimo.
 *          description: Rota para consultar os produtos abaixo do estoque mínimo da loja que está logada.
 *                       É necessário autenticação para acessá-la.
 *          tags: [Product]
 *      
 *          security:
 *            - Bearer: []
 *
 *          responses: 
 *              '200': 
 *                  description: Produtos consultados com sucesso!
 *                  schema:
 *                    type: object
 *                    properties:
 *                      products:
 *                        type: array
 *                        items:
 *                          $ref: '#/definitions/CompleteProduct'
 *              '400':
 *                  description: Erro ao consultar produtos no banco de dados.
 *                  schema:
 *                    $ref: '#/definitions/Error'
 *              '401':
 *                  description: Token inválido.
 *                  schema:
 *                    $ref: '#/definitions/ErrorToken'
 */
router.get('/api/less/than/min', auth_middleware, async (req, res) => {
    try {
        const products = await Product.find({
            id_store: req.store_id,
            $where: "this.quantity < this.min"
        })
        res.status(200).json({products})
    } catch(err) {
        res.status(400).json({ message: 'Erro ao consultar produtos.' })
    }
})

module.exports = router
