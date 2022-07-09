const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth_config = require('../config/auth')
require('../models/Store')
require('../models/Product')
require('../models/Item')
require('../models/Sale')
const Store = mongoose.model('stores')
const Product = mongoose.model('products')
const Item = mongoose.model('items')
const Sale = mongoose.model('sales')
const auth_middleware = require('../middlewares/auth')

// router.use(auth_middleware) // Middleware atuará nas rotas desse grupo.

/**
 * @swagger
 * securityDefinitions:
 *     Bearer:
 *       description: Efetue login para obter o token de autenticação.
 *       type: apiKey
 *       name: Authorization
 *       in: header
 */

 function generate_token(params = {}) {
    const token = jwt.sign(params, auth_config.secret, {
        expiresIn: 86400 // 1 dia.
    })
    return token
}

/**
 * @swagger
 * /store/authenticate:
 *      post:
 *          summary: Login do usuário.
 *          description: Rota para efetuar login do usuário, devendo ser informados
 *                       username e senha no corpo da requisição.
 *          tags: [Store]
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
        token: generate_token({id: store._id}),
        message: 'Login efetuado com sucesso!'
    })
})

/**
 * @swagger
 * /store/api:
 *      post:
 *          summary: Cadastro de loja.
 *          description: Rota para efetuar cadastro de loja, devendo ser informados
 *                       nome, username, senha e senha de administrador no corpo da requisição.
 *          tags: [Store]
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
                    new_store.password = undefined
                    new_store.admin_password = undefined
                    
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

/**
 * @swagger
 * /store/api/all:
 *      get:
 *          summary: Busca de todas as lojas.
 *          description: Rota para consultar todas as lojas cadastradas.
 *          tags: [Store]
 * 
 *          responses: 
 *              '200': 
 *                  description: Lojas consultadas com sucesso!
 *              '400':
 *                  description: Erro ao consultar lojas no banco de dados.
 *              '401':
 *                  description: Token inválido.
 */
router.get('/api/all', (req, res) => {
    Store.find()
        .then(stores => res.status(200).json({stores}))
        .catch(err => res.status(400).json({ message: 'Erro ao buscar lojas.' }))
})

/**
 * @swagger
 * /store/api:
 *      get:
 *          summary: Busca da loja que está logada.
 *          description: Rota para consultar uma loja específica por id.
 *                       É necessário estar logado para acessá-la.
 *          tags: [Store]
 *          security:
 *            - Bearer: []
 * 
 *          responses: 
 *              '200': 
 *                  description: Loja consultada com sucesso!
 *              '400':
 *                  description: Erro ao consultar loja no banco de dados ou loja não encontrada.
 *              '401':
 *                  description: Token inválido.
 */
router.get('/api', auth_middleware, (req, res) => { // Tirei o parâmetro id do path.
    const store_id = req.store_id
    // const store_id = req.params.id

    Store.findOne({_id: store_id})
        .then(store => {
            if(!store) {
                return res.status(400).json({ message: 'Loja não encontrada.' })
            } else {
                res.status(200).json({store})
            }
        })
        .catch(() => {return res.status(400).json({ message: 'Loja não encontrada.' })})
})

/**
 * @swagger
 * /store/api:
 *      put:
 *          summary: Edição de loja.
 *          description: Rota para editar informações da loja que estiver logada.
 *          tags: [Store]
 *          security:
 *            - Bearer: []
 *          
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
 *                  description: Loja editada com sucesso!
 *              '400':
 *                  description: Erro ao editar loja no banco de dados ou loja não encontrada.
 *              '401':
 *                  description: Token inválido.
 */
router.put('/api', auth_middleware, (req, res) => { // Tirei o parâmetro id do path.
    const store_id = req.store_id
    // const store_id = req.params.id

    if(!req.body.name || !req.body.username || !req.body.password || !req.body.admin_password)
        return res.status(400).json({ message: 'Faltam dados.' })

    //! Validar username, password e admin_password (definir critérios).

    Store.findOne({_id: store_id})
        .then(store => {
            if(!store) {
                return res.status(400).json({ message: 'Loja não encontrada.' })
            } else {
                store.name = req.body.name,
                // store.username = req.body.username,
                store.password = req.body.password,
                store.admin_password = req.body.admin_password
                
                if(store.username != req.body.username) { // Mudança de username, verificar se ele já existe ou não.
                    Store.findOne({username: req.body.username})
                        .then(store2 => {
                            if(store2) { // Tem loja com o mesmo username.
                                return res.status(400).json({ message: 'Username já está em uso.' })
                            } else {
                                store.username = req.body.username
                                store.save()
                                .then(() => res.json({ message: 'Loja editada com sucesso!' }))
                                .catch(err => res.status(400).json({ message: 'Erro ao editar loja.' }))
                            }
                        })
                        .catch(err => res.status(400).json({ message: 'Erro ao editar loja.' }))
                } else {
                    store.save()
                        .then((edited_store) => res.json({ 
                            edited_store,
                            message: 'Loja editada com sucesso!' 
                        }))
                        .catch(err => res.status(400).json({ message: 'Erro ao editar loja.' }))
                }
                
            }
        })
        .catch(err => res.status(400).json({ message: 'Erro ao editar loja.' }))
})

/**
 * @swagger
 * /store/api:
 *      delete:
 *          summary: Remoção de loja.
 *          description: Rota para excluir a loja que estiver logada. É necessário
 *                       passar a senha de administrador no corpo da requisição para permitir
 *                       a exclusão da loja, juntamente com todas as suas vendas e produtos.
 *          tags: [Store]
 *          security:
 *            - Bearer: []
 *          
 *          parameters:
 *          - in: body
 *            name: store
 *            schema:
 *              type: object
 *              properties:
 *                admin_password:
 *                  type: string
 *                  example: 123456admin
 * 
 *          responses: 
 *              '200': 
 *                  description: Loja deletada com sucesso!
 *              '400':
 *                  description: Erro ao deletar loja no banco de dados ou loja não encontrada.
 *              '401':
 *                  description: Token inválido.
 */
router.delete('/api', auth_middleware, async (req, res) => { // Tirei o parâmetro id do path.
    const store_id = req.store_id
    const admin_password = req.body.admin_password
    // const store_id = req.params.id
    
    try {
        let store = await Store.findOne({_id: store_id}).select('+admin_password')

        if(!store) {
            return res.status(400).json({ message: 'Loja inexistente.' })
        
        } else if(await bcrypt.compare(admin_password, store.admin_password)){
            await Product.deleteMany({id_store: store_id})
            await Item.deleteMany({id_store: store_id})
            await Sale.deleteMany({id_store: store_id})
            await Store.deleteOne({_id: store_id})

            return res.status(200).json({ message: 'Loja deletada com sucesso!' })
            
        } else {
            return res.status(400).json({ message: 'Senha de administrador incorreta.' })
        }

    } catch(err) {
        return res.status(400).json({ message: 'Erro ao deletar loja.' })
    }
    
    
    // Store.findOne({_id: store_id})
    //     .then(async store => {
    //         if(!store) {
    //             return res.status(400).json({ message: 'Loja inexistente.' })
    //         } else {
    //             if(!await bcrypt.compare(admin_password, store.admin_password)) { // Comparando senha de admin.
    //                 return res.status(400).json({ message: 'Senha de administrador incorreta.' })

    //             } else {
    //                 Store.deleteOne({_id: store_id})
    //                     .then(() => {
    //                         res.status(200).json({ message: 'Loja deletada com sucesso!' })
    //                     })
    //                     .catch(err => res.status(400).json({ message: 'Erro ao deletar loja1.' }))
    //             }
    //         }
    //     })
    //     .catch(async err => {
    //         return res.status(400).json({ message: 'Erro ao deletar loja2.' })
    //     })
})

module.exports = router
