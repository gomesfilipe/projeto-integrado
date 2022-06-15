const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth_config = require('../config/auth')
// require('../models/Product')
require('../models/Store')
// const Product = mongoose.model('products')
const Store = mongoose.model('stores')

function generate_token(params = {}) {
    const token = jwt.sign(params, auth_config.secret, {
        expiresIn: 86400 // 1 dia.
    })
    return token
}

// Autenticação após efetuar login.
router.post('/authenticate', async (req, res) => {
    const {username, password} = req.body

    if(!username || !password)
        return res.json({ message: 'Faltam dados.' })

    const store = await Store.findOne({username}).select('+password')

    if(!store) {
        return res.json({ message: 'Usuário não existente.' })
    }

    if(!await bcrypt.compare(password, store.password)) {
        return res.json({ message: 'Senha incorreta.' })
    }

    store.password = undefined // Para não mostrar no json. Não muda no banco de dados pois não deu .save(). 

    // const token = jwt.sign({id: store._id}, auth_config.secret, {
    //     expiresIn: 86400
    // })

    res.json({
        store, 
        token: generate_token({id: store._id})
    })
})

// Rota para efetuar cadastro.
router.post('/api', (req, res) => {
    const username = req.body.username
     
    if(!req.body.name || !req.body.username || !req.body.password || !req.body.admin_password)
        return res.json({ message: 'Faltam dados.' })
    
    //! Validar username, password e admin_password (definir critérios).

    Store.findOne({username: username})
        .then(store => {
            if(store) {
                return res.json({ message: 'Usuário já existente.' })
            }

            const new_store = new Store({
                name: req.body.name,
                username: req.body.username,
                password: req.body.password,
                admin_password: req.body.admin_password
            })
            
            new_store.save()
                .then(() => {
                    res.json({
                        new_store,
                        token: generate_token({id: new_store._id}), // Enviando token para já entrar na conta após cadastrar.
                        message: "Loja cadastrada com sucesso!"
                    })
                })
                .catch(err => res.json({ message: 'Erro ao cadastrar loja.' }))
        })
        .catch(err => res.json({ message: 'Erro ao cadastrar loja.' }))
})

module.exports = router
