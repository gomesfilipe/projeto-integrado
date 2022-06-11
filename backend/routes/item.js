const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Product')
require('../models/Store')
const Product = mongoose.model('products')
const Store = mongoose.model('stores')
const Item = mongoose.model('items')

router.get('/api', (req, res) => {
    Item.find()
        .then(items => res.json({items}))
        .catch(err => res.json('Erro ao buscar itens.'))
})

router.post('/api', (req, res) => {
    const item = new Item({
        id_product: req.body.id_product,
        id_store: req.body.id_store,
        quantity: Number(req.body.quantity)
    })

    item.save()
        .then(() => res.json('Item criado com sucesso!'))
        .catch(err => res.json('Erro ao criar item.'))
})

router.delete('/api/:id', (req, res) => {
    const item_id = req.params.id

    Item.findOne({_id: item_id})
        .then(item => {
            if(!item) {
                return res.json('Item inexistente.')
            } else {
                Item.deleteOne({id: item_id})
                    .then(() => res.json('Item deletado com sucesso!'))
                    .catch(err => res.json('Erro ao deletar item.'))
            }
        })
        .catch(err => res.json('Erro ao deletar item.'))
})
