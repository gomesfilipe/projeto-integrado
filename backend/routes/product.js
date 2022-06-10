const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Product')
const Product = mongoose.model('products')

router.get('/api', (req, res) => {
    Product.find()
        .then(products => res.json({products}))
        .catch(err => res.send('error' + err))
})

router.get('/api/:name', (req, res) => {
    const product_name = req.params.name

    Product.findOne({name: product_name})
        .then(products => {
            if(!products) {
                return res.json('Produto não encontrado.')
            } else {
                res.json(products)
            }
        })
        .catch(() => {return res.json('Produto não encontrado.')})
})

router.post('/api', (req, res) => {
    new Product({
        name: req.body.name,
        cost: Number(req.body.cost),
        sale: Number(req.body.sale),
        quantity: Number(req.body.quantity),
        photo: req.body.photo,
        unity: req.body.unity
    }).save()
        .then(() => res.json('Produto cadastrado com sucesso!'))
        .catch((err) => res.json('Erro ao cadastrar produto.'))
})

router.put('/api/:name', (req, res) => {
    const product_name = req.params.name

    Product.findOne({name: product_name})
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

router.delete('/api/:name', (req, res) => {
    const product_name = req.params.name

    Product.findOne({name: product_name})
        .then(product => {
            if(!product) {
                return res.json('Produto inexistente.')
            } else {
                Product.deleteOne({name: product_name})
                    .then(() => {
                        res.json('Produto deletado com sucesso!')
                    })
                    .catch(err => res.json('Erro ao deletar produto.'))
            }
        })
        .catch(err => {
            return res.json('Erro ao deletar produto.')
        })
})

module.exports = router
