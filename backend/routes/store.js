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
const no_auth_middleware = require('../middlewares/no_auth')

// router.use(auth_middleware) // Middleware atuará nas rotas desse grupo.

/**
 * @swagger
 * securityDefinitions:
 *     Bearer:
 *       description: Efetue login para obter o token de autenticação.
 *       type: apiKey
 *       name: Authorization
 *       in: header
 * 
 * definitions:
 *   Store:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *         example: Loja
 *       username:
 *         type: string
 *         example: loja123
 *       password:
 *         type: string
 *         example: 123456
 *       admin_password:
 *         type: string
 *         example: 123456admin
 *   
 *   NewStore:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *          example: Loja
 *        username:
 *          type: string
 *          example: loja123
 *        products:
 *          type: array
 *          items:
 *            type: string
 *            example:
 *        sales:
 *          items:
 *            type: string
 *            example: 
 *        _id:
 *          type: string
 *          example: 62caf274427bbcad14fcd604
 *        __v:
 *          type: number
 *          example: 0
 * 
 *   CompleteStore:
 *      type: object
 *      properties:
 *        _id: 
 *          type: string
 *          example: 62c9dfeab664c24450071b1a
 *        name:
 *          type: string
 *          example: Loja
 *        username:
 *          type: string
 *          example: loja123
 *        products:
 *          type: array
 *          items:
 *            type: string
 *            example: 62c9dfeab664c24450071b1a
 *        sales:
 *          type: array
 *          items:
 *            type: string
 *            example: 62c9dfeab664c24450071b1a
 *        __v:
 *          type: number
 *          example: 0
 * 
 *   Error:
 *     type: object
 *     properties:
 *       message:
 *         type: string
 *         example: error message
 *   
 *   Success:
 *     type: object
 *     properties:
 *       message:
 *         type: string
 *         example: success message
 * 
 *   Login:
 *     type: object
 *     properties:
 *       username:
 *         type: string
 *         example: loja123
 *       password:
 *         type: string
 *         example: 123456
 * 
 *   ErrorToken:
 *     type: object
 *     properties:
 *       err:
 *         type: string
 *         example: error token message
 * 
 *   AdminPassword:
 *     type: object
 *     properties:
 *       admin_password:
 *         type: string
 *         example: 123456admin
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
 *          summary: Login de loja.
 *          description: Rota para efetuar login de loja, devendo ser informados
 *                       username e senha no corpo da requisição. Só pode ser acessada
 *                       caso o usuário não esteja logado.
 *          tags: [Store]
 *          security:
 *            - Bearer: []
 * 
 *          parameters:
 *          - in: body
 *            name: store
 *            schema:
 *              $ref: '#/definitions/Login'
 * 
 *          responses: 
 *              '200': 
 *                  description: Login efetuado com sucesso!
 *                  schema:
 *                    type: object
 *                    properties:
 *                      store:
 *                        $ref: '#/definitions/CompleteStore'
 *                      token:
 *                        type: string
 *                        example: token here
 *                      message:  
 *                        type: string
 *                        example: success message
 *                      
 *              '400':
 *                  description: Erro ao efetuar login. (Faltaram dados no corpo da requisição,
 *                               ou o usuário não existe ou senha está incorreta)  
 *                  schema:
 *                    $ref: '#/definitions/Error'
 * 
 *              '401':
 *                  description: É probido acessar esta rota logado.
 *                  schema:
 *                    $ref: '#/definitions/ErrorToken'
 */
router.post('/authenticate', no_auth_middleware, async (req, res) => {
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
 *                       Só pode ser acessada caso o usuário não esteja logado.
 *          tags: [Store]
 *          security:
 *            - Bearer: []
 * 
 *          parameters:
 *          - in: body
 *            name: store
 *            schema:
 *              $ref: '#/definitions/Store'
 * 
 *          responses: 
 *              '200': 
 *                  description: Loja cadastrada com sucesso!
 *                  schema:
 *                    type: object
 *                    properties:
 *                      new_store:
 *                        $ref: '#/definitions/NewStore'
 *                      token:
 *                        type: string
 *                        example: token here
 *                      message:  
 *                        type: string
 *                        example: success message
 *                    
 *              '400':
 *                  description: Erro ao cadastrar loja. (Faltaram dados no corpo da requisição,
 *                               ou os dados não passaram pelo critérios de validação ou o
 *                               usuário já existe ou ocorreu falha ao salvar no banco de dados.)
 *                  schema:
 *                    $ref: '#/definitions/Error'
 *              '401':
 *                  description: É probido acessar esta rota logado.
 *                  schema:
 *                    $ref: '#/definitions/ErrorToken'
 */
router.post('/api', no_auth_middleware, (req, res) => {
    const username = req.body.username
     
    if(!req.body.name || !req.body.username || !req.body.password || !req.body.admin_password)
        return res.status(400).json({ message: 'Faltam dados.' })
    
    // Validação dos campos.
    if(req.body.username.length < 4)
        return res.status(400).json({ message: 'Tamanho do username deve ter no mínimo 4 caracteres.' })

    if(req.body.password.length < 4)
        return res.status(400).json({ message: 'Tamanho da senha deve ter no mínimo 4 caracteres.' })

    if(req.body.admin_password.length < 4)
        return res.status(400).json({ message: 'Tamanho da senha de administrador deve ter no mínimo 4 caracteres.' })

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
 * 
 * @swagger
 * /store/api/all:
 *      get:
 *          summary: Busca de todas as lojas.
 *          description: Rota para consultar dados de todas as lojas cadastradas.
 *                       Não é necessário autenticação para acessá-la.
 *          tags: [Store]
 * 
 *          responses: 
 *              '200': 
 *                  description: Lojas consultadas com sucesso!
 *                  schema:
 *                    type: object
 *                    properties:
 *                      stores:
 *                        type: array
 *                        items:
 *                          $ref: '#/definitions/CompleteStore'
 *              '400':
 *                  description: Erro ao consultar lojas no banco de dados.
 *                  schema:
 *                    $ref: '#/definitions/Error'
 *              '401':
 *                  description: Token inválido.
 *                  schema:
 *                    $ref: '#/definitions/ErrorToken'
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
 *          description: Rota para consultar dados da loja que está logada.
 *                       É necessário autenticação para acessá-la.
 *          tags: [Store]
 *          security:
 *            - Bearer: []
 * 
 *          responses: 
 *              '200': 
 *                  description: Loja consultada com sucesso!
 *                  schema:
 *                    type: object
 *                    properties:
 *                      store:
 *                        $ref: '#/definitions/CompleteStore'
 *              '400':
 *                  description: Erro ao consultar loja no banco de dados ou loja não encontrada.
 *                  schema:
 *                    $ref: '#/definitions/Error'
 *              '401':
 *                  description: Token inválido.
 *                  schema:
 *                    $ref: '#/definitions/ErrorToken'
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
        .catch(() => {return res.status(400).json({ message: 'Erro ao buscar loja.' })})
})

/**
 * @swagger
 * /store/api:
 *      put:
 *          summary: Edição da loja que está logada.
 *          description: Rota para editar informações da loja que estiver logada.
 *                       É necessário autenticação para acessá-la.
 *          tags: [Store]
 *          security:
 *            - Bearer: []
 *          
 *          parameters:
 *          - in: body
 *            name: store
 *            schema:
 *              $ref: '#/definitions/Store'
 * 
 *          responses: 
 *              '200': 
 *                  description: Loja editada com sucesso!
 *                  schema:
 *                    type: object
 *                    properties:
 *                      edited_store:
 *                        $ref: '#/definitions/CompleteStore'
 *                      message:  
 *                        type: string
 *                        example: success message
 *              '400':
 *                  description: Erro ao editar loja no banco de dados ou loja não encontrada ou algum parâmetro enviado inválido.
 *                  schema:
 *                    $ref: '#/definitions/Error'
 *              '401':
 *                  description: Token inválido.
 *                  schema:
 *                    $ref: '#/definitions/ErrorToken'
 */
router.put('/api', auth_middleware, (req, res) => { // Tirei o parâmetro id do path.
    const store_id = req.store_id
    // const store_id = req.params.id

    if(!req.body.name || !req.body.username || !req.body.password || !req.body.admin_password)
        return res.status(400).json({ message: 'Faltam dados.' })

    //! Validar username, password e admin_password (definir critérios).

    Store.findOne({_id: store_id})
        .then(async store => {
            if(!store) {
                return res.status(400).json({ message: 'Loja não encontrada.' })
            } else {
                store.name = req.body.name,
                // store.username = req.body.username,
                store.password = await bcrypt.hash(req.body.password, 10)
                store.admin_password = await bcrypt.hash(req.body.admin_password, 10)
                
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
 *          summary: Remoção da loja que está logada.
 *          description: Rota para excluir a loja que estiver logada. É necessário
 *                       passar a senha de administrador no corpo da requisição para permitir
 *                       a exclusão da loja, juntamente com todas as suas vendas e produtos.
 *                       É necessário autenticação para acessá-la.
 *          tags: [Store]
 *          security:
 *            - Bearer: []
 *          
 *          parameters:
 *          - in: body
 *            name: store
 *            schema:
 *              $ref: '#/definitions/AdminPassword' 
 * 
 *          responses: 
 *              '200': 
 *                  description: Loja deletada com sucesso!
 *                  schema:
 *                    $ref: '#/definitions/Success'
 *              '400':
 *                  description: Erro ao deletar loja no banco de dados ou loja não encontrada ou senha de administrador incorreta.
 *                  schema:
 *                    $ref: '#/definitions/Error'
 *              '401':
 *                  description: Token inválido.
 *                  schema:
 *                    $ref: '#/definitions/ErrorToken'
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
})

module.exports = router
