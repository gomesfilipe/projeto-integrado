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

router.get('/api', (req, res) => {
    Item.find()
        .then(items => res.json({ items }))
        .catch(err => res.json({ message: 'Erro ao buscar itens.' }))
})

router.post('/api', (req, res) => {
    if(!req.body.id_product || !req.body.id_store || !req.body.quantity)
        return res.json({ message: 'Faltam dados.' })
    
    if(isNaN(req.body.quantity))
        return res.json({ message: 'Há dados inválidos.'})
        
    const item = new Item({
        id_product: req.body.id_product,
        id_store: req.body.id_store,
        quantity: Number(req.body.quantity)
    })

    item.save()
        .then(() => res.json({ message: 'Item criado com sucesso!' }))
        .catch(err => res.json({ message: 'Erro ao criar item.' }))
})

router.delete('/api/:id', (req, res) => {
    const item_id = req.params.id

    Item.findOne({_id: item_id})
        .then(item => {
            if(!item) {
                return res.json({ message: 'Item inexistente.' })
            } else {
                Item.deleteOne({id: item_id})
                    .then(() => res.json({ message: 'Item deletado com sucesso!' }))
                    .catch(err => res.json({ message: 'Erro ao deletar item.' }))
            }
        })
        .catch(err => res.json({ message: 'Erro ao deletar item.' }))
})

module.exports = router
