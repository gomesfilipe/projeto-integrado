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

/**
 * @swagger
 * /nologged/authenticate:
 *      post:
 *          summary: Login do usuário.
 *          description: Rota para efetuar login do usuário, devendo ser informados
 *                       username e senha no corpo da requisição.
 *          tags: [No Logged]
 *          parameters:
 *          - in: body
 *            name: store
 *            schema:
 *              type: object
 *              properties:
 *                username:
 *                  type: string
 *                  example: loja123
 *                password:
 *                  type: string
 *                  example: 123456
 * 
 *          responses: 
 *              '200': 
 *                  description: Login efetuado com sucesso!
 *              '400':
 *                  description: Erro ao efetuar login. (Faltaram dados no corpo da requisição,
 *                               ou o usuário não existe ou senha está incorreta)
 */
router.post('/authenticate', async (req, res) => {
    const {username, password} = req.body

    if(!username || !password)
        return res.status(400).json({ message: 'Faltam dados.' })

    const store = await Store.findOne({username}).select('+password')

    if(!store) {
        return res.status(400).json({ message: 'Usuário não existente.' })
    }

    if(!await bcrypt.compare(password, store.password)) {
        return res.status(400).json({ message: 'Senha incorreta.' })
    }

    store.password = undefined // Para não mostrar no json. Não muda no banco de dados pois não deu .save(). 

    // const token = jwt.sign({id: store._id}, auth_config.secret, {
    //     expiresIn: 86400
    // })

    res.status(200).json({
        store, 
        token: generate_token({id: store._id})
    })
})

/**
 * @swagger
 * /nologged/api:
 *      post:
 *          summary: Cadastro de loja.
 *          description: Rota para efetuar cadastro de loja, devendo ser informados
 *                       nome, username, senha e senha de administrador no corpo da requisição.
 *          tags: [No Logged]
 *          parameters:
 *          - in: body
 *            name: store
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  example: Loja
 *                username:
 *                  type: string
 *                  example: loja123
 *                password:
 *                  type: string
 *                  example: 123456
 *                admin_password:
 *                  type: string
 *                  example: 123456admin
 * 
 *          responses: 
 *              '200': 
 *                  description: Loja cadastrada com sucesso!
 *              '400':
 *                  description: Erro ao cadastrar loja. (Faltaram dados no corpo da requisição,
 *                               ou o usuário já existe ou ocorreu falha ao salvar no banco de dados.)
 */
router.post('/api', (req, res) => {
    const username = req.body.username
     
    if(!req.body.name || !req.body.username || !req.body.password || !req.body.admin_password)
        return res.status(400).json({ message: 'Faltam dados.' })
    
    //! Validar username, password e admin_password (definir critérios).

    Store.findOne({username: username})
        .then(async store => {
            if(store) {
                return res.status(400).json({ message: 'Usuário já existente.' })
            }

            const new_store = new Store({
                name: req.body.name,
                username: req.body.username,
                password: await bcrypt.hash(req.body.password, 10),
                admin_password: await bcrypt.hash(req.body.admin_password, 10)
            })

            // const new_store = new Store({
            //     name: req.body.name,
            //     username: req.body.username,
            //     password: req.body.password,
            //     admin_password: req.body.admin_password
            // })
            
            new_store.save()
                .then(() => {
                    res.status(200).json({
                        new_store,
                        token: generate_token({id: new_store._id}), // Enviando token para já entrar na conta após cadastrar.
                        message: "Loja cadastrada com sucesso!"
                    })
                })
                .catch(err => res.status(400).json({ message: 'Erro ao cadastrar loja.' }))
        })
        .catch(err => res.status(400).json({ message: 'Erro ao cadastrar loja.' }))
})

module.exports = router
