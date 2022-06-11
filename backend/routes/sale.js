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

router.get('/api', (req, res) => {
    Sale.find()
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
        .catch(err => res.json('Erro ao concluir venda. ' + err))
})

router.delete('/api/:id', (req, res) => {
    const sale_id = req.params.id
    // console.log('sale_id: ' + sale_id)
    Sale.findOne({_id: sale_id})
        .then(sale => {
            console.log(sale)
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
