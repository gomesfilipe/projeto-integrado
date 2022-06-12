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

router.get('/api/all', (req, res) => {
    Sale.find()
        .then(sales => res.json({sales}))
        .catch(err => res.json('Erro ao buscar vendas.'))
})

router.get('/api/dates', (req, res) => {
    Sale.find({"date": {
        "$gte": req.body.from_date, // Início do período. Obs: devem estar no formato ISO.
        "$lt": req.body.to_date // Fim do período. Exemplo: "2022-06-12T14:49:01.686Z"
    }})
        .then(sales => res.json({sales}))
        .catch(err => res.json('Erro ao buscar vendas.'))
})

router.post('/api', (req, res) => {
    const sale = new Sale({
        items: req.body.items,
        value: req.body.value,
        id_store: req.body.id_store
    })

    sale.save()
        .then(() => {
            Store.findOne({id: req.body.id_store})
                .then(store => {
                    store.sales.push(sale)
                    store.save()
                        .then(() => res.json('Venda concluída com sucesso!'))
                        .catch(err => res.json('Erro ao concluir venda.'))
                })
                .catch(err => res.json('Erro ao concluir venda.'))
        })
        .catch(err => res.json('Erro ao concluir venda.'))
})

router.delete('/api/:id', (req, res) => {
    const sale_id = req.params.id
    // console.log('sale_id: ' + sale_id)
    Sale.findOne({_id: sale_id})
        .then(sale => {
            if(!sale) {
                return res.json('Venda inexistente.')
            } else {
                Sale.deleteOne({_id: sale_id})
                    .then(() => res.json('Venda deletada com sucesso!'))
                    .catch(err => res.json('Erro ao deletar venda.'))
            }
        })
        .catch(err => res.json('Erro ao deletar venda.'))
})

module.exports = router
