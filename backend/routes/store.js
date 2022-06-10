const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Store')
require('../models/Product')
const Store = mongoose.model('stores')
const Product = mongoose.model('products')

router.get('/api', (req, res) => {
    Store.find()
        .then(stores => res.json({stores}))
        .catch(err => res.send('error' + err))
})

router.get('/api/:name', (req, res) => {
    const store_name = req.params.name

    Store.findOne({name: store_name})
        .then(store => {
            if(!store) {
                return res.json('Loja não encontrada.')
            } else {
                res.json(store)
            }
        })
        .catch(() => {return res.json('Loja não encontrada.')})
})

router.post('/api', (req, res) => {
    new Store({
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        admin_password: req.body.admin_password
    }).save()
        .then(() => res.json('Loja cadastrada com sucesso!'))
        .catch((err) => res.json('Erro ao cadastrar loja.'))
})

router.put('/api/:name', (req, res) => {
    const store_name = req.params.name

    Store.findOne({name: store_name})
        .then(store => {
            if(!store) {
                return res.json('Loja não encontrada.')
            } else {
                store.name = req.body.name,
                store.username = req.body.username,
                store.password = req.body.password,
                store.admin_password = req.body.admin_password

                store.save()
                    .then(() => res.json('Loja editada com sucesso!'))
                    .catch(err => res.json('Erro ao editar loja.'))
            }
        })
        .catch(err => res.json('Erro ao editar loja.'))
})

router.delete('/api/:name', (req, res) => {
    const store_name = req.params.name

    Store.findOne({name: store_name})
        .then(store => {
            if(!store) {
                return res.json('Loja inexistente.')
            } else {
                Store.deleteOne({name: store_name})
                    .then(() => {
                        res.json('Loja deletada com sucesso!')
                    })
                    .catch(err => res.json('Erro ao deletar loja.'))
            }
        })
        .catch(err => {
            return res.json('Erro ao deletar loja.')
        })
})

module.exports = router
