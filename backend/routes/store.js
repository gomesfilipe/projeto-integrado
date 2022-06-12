const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Store')
require('../models/Product')
const Store = mongoose.model('stores')
const Product = mongoose.model('products')
// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')
// const auth_config = require('../config/auth')
const auth_middleware = require('../middlewares/auth')

router.use(auth_middleware) // Middleware atuará nas rotas desse grupo.

// function generate_token(params = {}) {
//     const token = jwt.sign(params, auth_config.secret, {
//         expiresIn: 86400 // 1 dia.
//     })
//     return token
// }

// // Autenticação após efetuar login.
// router.post('/authenticate', async (req, res) => {
//     const {username, password} = req.body

//     const store = await Store.findOne({username}).select('+password')

//     if(!store) {
//         return res.json('Usuário não existente.')
//     }

//     if(!await bcrypt.compare(password, store.password)) {
//         return res.json('Senha incorreta.')
//     }

//     store.password = undefined // Para não mostrar no json. Não muda no banco de dados pois não deu .save(). 

//     // const token = jwt.sign({id: store._id}, auth_config.secret, {
//     //     expiresIn: 86400
//     // })

//     res.json({
//         store, 
//         token: generate_token({id: store._id})
//     })
// })

router.get('/api', (req, res) => {
    Store.find()
        .then(stores => res.json({stores}))
        .catch(err => res.json({message: 'Erro ao buscas lojas.'}))
        // .catch(err => res.json('Erro ao buscar lojas.'))
})

router.get('/api/:id', (req, res) => {
    const store_id = req.params.id

    Store.findOne({_id: store_id})
        .then(store => {
            if(!store) {
                return res.json('Loja não encontrada.')
            } else {
                res.json({store})
            }
        })
        .catch(() => {return res.json('Loja não encontrada.')})
})

// router.post('/api', (req, res) => {
//     const username = req.body.username
    
//     Store.findOne({username: username})
//         .then(store => {
//             if(store) {
//                 return res.json('Usuário já existente.')
//             }

//             const new_store = new Store({
//                 name: req.body.name,
//                 username: req.body.username,
//                 password: req.body.password,
//                 admin_password: req.body.admin_password
//             })
            
//             new_store.save()
//                 .then(() => {
//                     res.json({
//                         new_store,
//                         token: generate_token({id: new_store._id}), // Enviando token para já entrar na conta após cadastrar.
//                         message: "Loja cadastrada com sucesso!"
//                     })
//                 })
//                 .catch(err => res.json('Erro ao cadastrar loja.'))
//         })
//         .catch(err => res.json('Erro ao cadastrar loja.'))
// })

// router.post('/api', (req, res) => {
//     const username = req.body.username
    
//     Store.findOne({username: username})
//         .then(store => {
//             if(store) {
//                 return res.json('Usuário já existente.')
//             }

//             new Store({
//                 name: req.body.name,
//                 username: req.body.username,
//                 password: req.body.password,
//                 admin_password: req.body.admin_password
//             }).save()
//                 .then(() => res.json('Loja cadastrada com sucesso!'))
//                 .catch(err => res.json('Erro ao cadastrar loja.'))
//         })
//         .catch(err => res.json('Erro ao cadastrar loja.'))
// })

router.put('/api/:id', (req, res) => {
    const store_id = req.params.id

    Store.findOne({_id: store_id})
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

router.delete('/api/:id', (req, res) => {
    const store_id = req.params.id

    Store.findOne({_id: store_id})
        .then(store => {
            if(!store) {
                return res.json('Loja inexistente.')
            } else {
                Store.deleteOne({_id: store_id})
                    .then(() => {
                        res.json('Loja deletada com sucesso!')
                    })
                    .catch(err => res.json('Erro ao deletar loja.'))
            }
        })
        .catch(err => {
            return res.json('Erro ao deletar loja.'+err)
        })
})

module.exports = router
