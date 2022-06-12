const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Product')
require('../models/Store')
const Product = mongoose.model('products')
const Store = mongoose.model('stores')

const auth_middleware = require('../middlewares/auth')

router.use(auth_middleware) // Middleware atuará nas rotas desse grupo.

router.get('/api/all', (req, res) => {
    Product.find()
        .then(products => res.json({products}))
        .catch(err => res.json('Erro ao buscar produtos.'))
})

router.get('/api/id/:id', (req, res) => {
    const product_id = req.params.id

    Product.findOne({_id: product_id})
        .then(products => {
            if(!products) {
                return res.json('Produto não encontrado.')
            } else {
                res.json({products})
            }
        })
        .catch(() => {return res.json('Produto não encontrado.')})
})

router.get('/api/name/:name', (req, res) => {
    const product_name = req.params.name

    Product.find({name: {
        "$regex": `^(${product_name})`,
        "$options": "i" // Não diferencia letras maiúsculas de minúsculas.
    }})
        .then(products => {
            if(!products) {
                return res.json('Produto não encontrado.')
            } else {
                res.json({products})
            }
        })
        .catch(() => {return res.json('Produto não encontrado.')})
})

router.post('/api', (req, res) => {
    const name1 = req.body.name
    const id_store1 = req.body.id_store

    Product.findOne({name: name1, id_store: id_store1})
        .then(product => {
            if(product) {
                return res.json('Produto já existente.')
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
                                .then(() => res.json('Produto cadastrado e inserido na loja com sucesso!'))
                                .catch(err => res.json('Erro ao cadastrar e inserir produto na loja.'+err))
                        })
                        .catch(err => res.json('Erro ao cadastrar produto2.'))
                })
                .catch(err => res.json('Erro ao cadastrar produto1.'))  
        })
})

router.put('/api/:id', (req, res) => {
    const product_id = req.params.id

    Product.findOne({_id: product_id})
        .then(product => {
            if(!product) {
                return res.json('Produto não encontrada.')
            } else {
                product.name = req.body.name,
                product.cost = Number(req.body.cost),
                product.sale = Number(req.body.sale),
                product.quantity = Number(req.body.quantity),
                product.photo = req.body.photo,
                product.unity = req.body.unity

                product.save()
                    .then(() => res.json('Produto editado com sucesso!'))
                    .catch(err => res.json('Erro ao editar produto.'))
            }
        })
        .catch(err => res.json('Erro ao editar produto.'))
})

router.delete('/api/:id', (req, res) => {
    const product_id = req.params.id

    Product.findOne({_id: product_id})
        .then(product => {
            if(!product) {
                return res.json('Produto inexistente.')
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
                                        res.json('Produto deletado com sucesso!')
                                    })
                                    .catch(err => res.json('Erro ao deletar produto.'))
                            })
                            .catch(err => res.json('Erro ao deletar produto.'))

                    })
                    .catch(err => res.json('Erro ao deletar produto.'))     
            }
        })
        .catch(err => {
            return res.json('Erro ao deletar produto.'+err)
        })
})

module.exports = router
