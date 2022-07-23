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
        expiresIn: 3600 // 1 hora.
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
 *                       Os campos username, senha e senha de administrador devem ter no mínimo 4 caracteres.
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
router.post('/api', no_auth_middleware, async (req, res) => {
    const name = req.body.name
    const username = req.body.username
    const password = req.body.password
    const admin_password = req.body.admin_password

    if(!name || !username || !password || !admin_password)
        return res.status(400).json({ message: 'Faltam dados.' })
    
    // Validação dos campos.
    if(username.length < 4)
        return res.status(400).json({ message: 'Tamanho do username deve ter no mínimo 4 caracteres.' })

    if(password.length < 4)
        return res.status(400).json({ message: 'Tamanho da senha deve ter no mínimo 4 caracteres.' })

    if(admin_password.length < 4)
        return res.status(400).json({ message: 'Tamanho da senha de administrador deve ter no mínimo 4 caracteres.' })

    try {
        const store_same_name = await Store.findOne({ name: name })
    
        if(store_same_name)
            return res.status(400).json({ message: 'Nome de loja já existente.' })
    
        const store_same_username = await Store.findOne({ username: username })
    
        if(store_same_username)
            return res.status(400).json({ message: 'Username de loja já existente.' })
    
        const store = new Store({
            name: name,
            username: username,
            password: await bcrypt.hash(password, 10),
            admin_password: await bcrypt.hash(admin_password, 10)
        }) 
    
        const new_store = await store.save()
    
        return res.status(200).json({
            new_store,
            token: generate_token({id: new_store._id}), // Enviando token para já entrar na conta após cadastrar.
            message: "Loja cadastrada com sucesso!"
        })

    } catch(err) {
        return res.status(400).json({ message: 'Erro ao cadastrar loja.' })
    }
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
router.get('/api/all', async (req, res) => {
    try {
        const stores = await Store.find()
        return res.status(200).json({ stores })
    } catch(err) {
        return res.status(400).json({ message: 'Erro ao buscar lojas.' })
    }
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
router.get('/api', auth_middleware, async (req, res) => {
    try {
        const store_id = req.store_id
        const store = await Store.findOne({ _id: store_id })
        if(!store) {
            return res.status(400).json({ message: 'Loja não encontrada.' })
        }

        return res.status(200).json({ store })

    } catch(err) {
        return res.status(400).json({ message: 'Erro ao buscar loja.' })
    }
})

/**
 * @swagger
 * /store/api/edit/name:
 *      put:
 *          summary: Edição de nome da loja que está logada.
 *          description: Rota para editar o nome da loja que estiver logada.
 *                       É necessário autenticação para acessá-la.
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
 *                  example: Novo nome              
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
router.put('/api/edit/name', auth_middleware, async (req, res) => {
    const store_id = req.store_id
    const name = req.body.name

    if(!name) {
        return res.status(400).json({ message: 'Faltam dados.' })
    }

    try {
        const store_same_name = await Store.findOne({ name: name })
    
        if(store_same_name) {
            return res.status(400).json({ message: 'Nome de loja já existente.' })
        }

        let store = await Store.findOne({ _id: store_id })
        store.name = name
        const edited_store = await store.save()
        return res.status(200).json({
            edited_store, 
            message: 'Loja editada com sucesso!'
        })

    } catch(err) {
        return res.status(400).json({ message: 'Erro ao editar loja.' })
    }
})

/**
 * @swagger
 * /store/api/edit/username:
 *      put:
 *          summary: Edição de username da loja que está logada.
 *          description: Rota para editar o username da loja que estiver logada.
 *                       É necessário autenticação para acessá-la.
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
 *                username:
 *                  type: string
 *                  example: Novo username              
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
router.put('/api/edit/username', auth_middleware, async (req, res) => {
    const store_id = req.store_id
    const username = req.body.username

    if(!username) {
        return res.status(400).json({ message: 'Faltam dados.' })
    }

    if(username.length < 4) {
        return res.status(400).json({ message: 'Tamanho do username deve ter no mínimo 4 caracteres.' })
    }

    try {
        const store_same_username = await Store.findOne({ username: username })
    
        if(store_same_username) {
            return res.status(400).json({ message: 'Username de loja já existente.' })
        }

        let store = await Store.findOne({ _id: store_id })
        store.username = username
        const edited_store = await store.save()
        return res.status(200).json({
            edited_store, 
            message: 'Loja editada com sucesso!'
        })

    } catch(err) {
        return res.status(400).json({ message: 'Erro ao editar loja.' })
    }
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
router.delete('/api', auth_middleware, async (req, res) => {
    const store_id = req.store_id
    const admin_password = req.body.admin_password
    
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
