const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Product')
require('../models/Store')
const Product = mongoose.model('products')
const Store = mongoose.model('stores')

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
 * /product/api/all:
 *      get:
 *          summary: Busca de todos os produtos de todas as lojas cadastradas.
 *          description: Rota para consultar todos os produtos cadastrados.
 *                       É necessário estar logado para acessá-la.
 *          tags: [Product]
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
    Product.find()
        .then(products => res.status(200).json({products}))
        .catch(err => res.status(400).json({ message: 'Erro ao buscar produtos.' }))
})

/**
 * @swagger
 * /product/api/id/{id}:
 *      get:
 *          summary: Busca de produto por id.
 *          description: Rota para consultar um produto específico por id.
 *                       É necessário estar logado para acessá-la.
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
 *                  description: Produto consultado com sucesso!
 *              '400':
 *                  description: Erro ao consultar produto no banco de dados ou produto não encontrada.
 *              '401':
 *                  description: Token inválido.
 */
router.get('/api/id/:id', (req, res) => {
    const product_id = req.params.id

    Product.findOne({_id: product_id})
        .then(products => {
            if(!products) {
                return res.status(400).json({ message: 'Produto não encontrado.' })
            } else {
                res.status(200).json({products})
            }
        })
        .catch(() => {return res.status(400).json({ message: 'Produto não encontrado.' })})
})

/**
 * @swagger
 * /product/api/name/{name}/{page}/{size_page}:
 *      get:
 *          summary: Busca de produtos por nome.
 *          description: Rota para consultar produtos que contenham seu nome iniciado pelo parâmetro passado.
 *                       Deve-se passar no corpo da requisição o número e tamanho da página de produtos.
 *                       É necessário estar logado para acessar esta rota.
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
 *              '400':
 *                  description: Erro ao consultar produto no banco de dados ou produto não encontrado ou faltam dados no corpo da requisição.
 *              '401':
 *                  description: Token inválido.
 */
router.get('/api/name/:name/:page/:size_page', (req, res) => {
    const product_name = req.params.name
    const page = req.params.page
    const size_page = req.params.size_page

    // Coloquei page e size_page no path pois requisições get não podem ter body.
    // const page = req.body.page
    // const size_page = req.body.size_page

    if(!product_name || !page || !size_page)
        return res.status(400).json({ message: 'Faltam dados.' })

    if(isNaN(page) || isNaN(size_page))
        return res.status(400).json({ message: 'Há dados inválidos.'})

    Product.find({name: {
        "$regex": `^(${product_name})`,
        "$options": "i" // Não diferencia letras maiúsculas de minúsculas.
    }})
        .skip(page > 0 ? ((page - 1) * size_page) : 0)
        .limit(size_page)
        .then(products => {
            if(!products) {
                return res.status(400).json({ message: 'Produto não encontrado.' })
            } else {
                res.status(200).json({products})
            }
        })
        .catch(() => {return res.status(400).json({ message: 'Produto não encontrado.' })})
})

/**
 * @swagger
 * /product/api:
 *      post:
 *          summary: Cadastro de produto.
 *          description: Rota para efetuar cadastro de produto, devendo ser informados
 *                       nome, preço de custo, preço de venda, quantidade, link para foto, unidade e id de sua loja.
 *                       É necessário estar logado para acessá-la.
 *          tags: [Product]
 *          security:
 *            - Bearer: []
 *          parameters:
 *          - in: body
 *            name: product
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  example: Martelo
 *                cost:
 *                  type: string
 *                  example: 30.50
 *                sale:
 *                  type: string
 *                  example: 50.99
 *                quantity:
 *                  type: string
 *                  example: 10
 *                photo:
 *                  type: string
 *                  example: www.link.para.foto.com
 *                unity:
 *                  type: string
 *                  example: Unidade
 *                id_store:
 *                  type: string
 *                  example: 62c09d7840704893c5334865
 * 
 *          responses: 
 *              '200': 
 *                  description: Produto cadastrado com sucesso!
 *              '400':
 *                  description: Erro ao cadastrar produto. (Faltaram dados no corpo da requisição,
 *                               ou o produto já existe, ou ocorreu falha ao salvar no banco de dados ou 
 *                               dados foram passados de modo incorreto)
 *              '401':
 *                  description: Token inválido.
 */
router.post('/api', (req, res) => {
    const name1 = req.body.name
    const id_store1 = req.body.id_store

    if(!req.body.name || !req.body.cost || !req.body.sale || !req.body.quantity || !req.body.photo || !req.body.unity || !req.body.id_store)
        return res.status(400).json({ message: 'Faltam dados.' })

    if(isNaN(req.body.cost) || isNaN(req.body.sale) || isNaN(req.body.quantity))
        return res.status(400).json({ message: 'Há dados inválidos.' })

    Product.findOne({name: name1, id_store: id_store1})
        .then(product => {
            if(product) {
                return res.status(400).json({ message: 'Produto já existente.' })
            }

            const new_product = new Product({
                name: req.body.name,
                cost: Number(req.body.cost),
                sale: Number(req.body.sale),
                quantity: Number(req.body.quantity),
                photo: req.body.photo,
                unity: req.body.unity,
                id_store: req.body.id_store
            })

            new_product.save()
                .then(() => {
                    Store.findOne({_id: req.body.id_store})
                        .then(store => {
                            store.products.push(new_product)
                            store.save()
                                .then(() => res.status(200).json({ message: 'Produto cadastrado e inserido na loja com sucesso!' }))
                                .catch(err => res.status(400).json({ message: 'Erro ao cadastrar e inserir produto na loja.' }))
                        })
                        .catch(err => res.status(400).json({ message: 'Erro ao cadastrar produto.' }))
                })
                .catch(err => res.status(400).json({ message: 'Erro ao cadastrar produto.' }))  
        })
})

/**
 * @swagger
 * /product/api/{id}:
 *      put:
 *          summary: Edição de produto.
 *          description: Rota para efetuar edição de produto, devendo ser informados
 *                       nome, preço de custo, preço de venda, quantidade, link para foto, unidade e id de sua loja atualizados.
 *                       É necessário estar logado para acessá-la.
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
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  example: Martelo
 *                cost:
 *                  type: string
 *                  example: 30.50
 *                sale:
 *                  type: string
 *                  example: 50.99
 *                quantity:
 *                  type: string
 *                  example: 10
 *                photo:
 *                  type: string
 *                  example: www.link.para.foto.com
 *                unity:
 *                  type: string
 *                  example: Unidade
 * 
 *          responses: 
 *              '200': 
 *                  description: Produto editado com sucesso!
 *              '400':
 *                  description: Erro ao editar produto. (Faltaram dados no corpo da requisição,
 *                               ou o produto não existe, ou ocorreu falha ao salvar edição no banco de dados ou 
 *                               dados foram passados de modo incorreto)
 *              '401':
 *                  description: Token inválido.
 */
router.put('/api/:id', (req, res) => {
    const product_id = req.params.id

    if(!req.body.name || !req.body.cost || !req.body.sale || !req.body.quantity || !req.body.photo || !req.body.quantity)
        return res.status(400).json({ message: 'Faltam dados.' })

    if(isNaN(req.body.cost) || isNaN(req.body.sale) || isNaN(req.body.quantity))
        return res.status(400).json({ message: 'Há dados inválidos.'})


    Product.findOne({_id: product_id})
        .then(product => {
            if(!product) {
                return res.status(400).json({ message: 'Produto não encontrado.' })
            } else {
                product.name = req.body.name,
                product.cost = Number(req.body.cost),
                product.sale = Number(req.body.sale),
                product.quantity = Number(req.body.quantity),
                product.photo = req.body.photo,
                product.unity = req.body.unity

                product.save()
                    .then(() => res.status(200).json({ message: 'Produto editado com sucesso!' }))
                    .catch(err => res.status(400).json({ message: 'Erro ao editar produto.' }))
            }
        })
        .catch(err => res.status(400).json({ message: 'Erro ao editar produto.' }))
})

/**
 * @swagger
 * /product/api/{id}:
 *      delete:
 *          summary: Exclusão de produto por id.
 *          description: Rota para deletar um produto específico por id.
 *                       É necessário estar logado para acessá-la.
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
 *              '400':
 *                  description: Erro ao deletar produto no banco de dados ou produto não encontrado.
 *              '401':
 *                  description: Token inválido.
 */
router.delete('/api/:id', (req, res) => {
    const product_id = req.params.id

    Product.findOne({_id: product_id})
        .then(product => {
            if(!product) {
                return res.status(400).json({ message: 'Produto inexistente.' })
            } else {
                Store.findOne({_id: product.id_store})
                    .then(store => {
                        const index = store.products.indexOf(product_id)

                        if(index > -1) {
                            store.products.splice(index, 1) // Deletando produto da lista de produtos da loja.
                        }
                        
                        store.save()
                            .then(() => {
                                Product.deleteOne({_id: product_id})
                                    .then(() => {
                                        res.status(200).json({ message: 'Produto deletado com sucesso!' })
                                    })
                                    .catch(err => res.status(400).json({ message: 'Erro ao deletar produto.' }))
                            })
                            .catch(err => res.status(400).json({ message: 'Erro ao deletar produto.' }))

                    })
                    .catch(err => res.status(400).json({ message: 'Erro ao deletar produto.' }))     
            }
        })
        .catch(err => {
            return res.status(400).json({ message: 'Erro ao deletar produto.' })
        })
})

module.exports = router
