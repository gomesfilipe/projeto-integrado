const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
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
                        .then(() => res.json({ message: 'Loja editada com sucesso!' }))
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
        const store = await Store.findOne({_id: store_id}).select('+admin_password')

        if(!store) {
            return res.status(400).json({ message: 'Loja inexistente.' })
        
        } else if(await bcrypt.compare(admin_password, store.admin_password)){
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
