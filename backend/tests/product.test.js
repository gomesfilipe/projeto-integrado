const request = require('supertest')
const app = require('../routes')
const mongoose = require('mongoose')
require('../models/Product')
require('../models/Store')
require('../models/Sale')
require('../models/Item')
const Store = mongoose.model('stores')
const Product = mongoose.model('products')
const Sale = mongoose.model('sales')
const Item = mongoose.model('items')
const seed = require('./seeds')

describe('Testes nas rotas relacionadas a produtos', () => {
    let token
    let objects
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost/sisvefake_producttests') // Conectando a um banco de dados fake para os testes.
        await Store.deleteMany({})
        await Product.deleteMany({})
        await Sale.deleteMany({})
        await Item.deleteMany({})
        objects = await seed()

        const res = await request(app).post('/store/authenticate')
            .send({
                username:'super123',
                password: '123456'
            })
        
        token = `Bearer ${res.body.token}`
    })
    
    afterAll(async () => {
        mongoose.connection.close()
    })
    
    
    it('Cadastro de produto', async () => {
        const res = await request(app).post('/product/api')
            .set({ Authorization: token })
            .send({
                name: 'Ketchup',
                cost: 10.5,
                sale: 15.5,
                quantity: 60,
                unity:'Unidade',
                min: 30
            })
        
        const product = await Product.findOne({ name: 'Ketchup' })
        expect(product).not.toBe(null)

        expect(res.body).toHaveProperty('product')
        expect(res.body).toHaveProperty('message')
        expect(res.statusCode).toBe(200)
    })

    it('Cadastrar produto com nome já existente', async () => {
        const res = await request(app).post('/product/api')
        .set({ Authorization: token })
        .send({
            name: 'Arroz',
            cost: 10.5,
            sale: 15.5,
            quantity: 60,
            unity:'Unidade',
            min: 30
        })

        expect(res.body).not.toHaveProperty('product')
        expect(res.body).toHaveProperty('message')
        expect(res.statusCode).toBe(400)
    })

    it('Cadastrar produto com parâmetros vazios', async () => {
        const res = await request(app).post('/product/api')
        .set({ Authorization: token })
        .send({
            name: 'Maionese',
            cost: 10.5,
            quantity: 60,
            unity:'Unidade',
        })

        expect(res.body).not.toHaveProperty('product')
        expect(res.body).toHaveProperty('message')
        expect(res.statusCode).toBe(400)
    })

    it('Cadastrar produto com parâmetros inválidos 1', async () => {
        const res = await request(app).post('/product/api')
        .set({ Authorization: token })
        .send({
            name: 'Maionese',
            cost: 'abcdef',
            sale: 15.5,
            quantity: 'abcdef',
            unity:'Unidade',
            min: 30
        })

        expect(res.body).not.toHaveProperty('product')
        expect(res.body).toHaveProperty('message')
        expect(res.statusCode).toBe(400)
    })

    it('Cadastrar produto com parâmetros inválidos 2', async () => {
        const res = await request(app).post('/product/api')
        .set({ Authorization: token })
        .send({
            name: 'Maionese',
            cost: -20.5,
            sale: 15.5,
            quantity: -15,
            unity:'Unidade',
            min: -7
        })

        expect(res.body).not.toHaveProperty('product')
        expect(res.body).toHaveProperty('message')
        expect(res.statusCode).toBe(400)
    })

    it('Editar produto', async () => {
        const id_product1 = objects.product1._id
        const res = await request(app).put(`/product/api/${id_product1}`)
            .set({ Authorization: token })
            .send({
                name: 'Ketchup Tradicional',
                cost: 15.5,
                sale: 20.5,
                quantity: 50,
                unity:'Unidade',
                min: 30
            })

        expect(res.body).toHaveProperty('edited_product')
        expect(res.body).toHaveProperty('message')
        expect(res.body.edited_product.name).toBe('Ketchup Tradicional')
        expect(res.body.edited_product.cost).toBe(15.5)
        expect(res.body.edited_product.sale).toBe(20.5)
        expect(res.body.edited_product.quantity).toBe(50)
        expect(res.body.edited_product.unity).toBe('Unidade')
        expect(res.body.edited_product.min).toBe(30)
        expect(res.statusCode).toBe(200)
    })

    it('Editar produto colocando nome já existente', async () => {
        const id_product1 = objects.product1._id
        const res = await request(app).put(`/product/api/${id_product1}`)
            .set({ Authorization: token })
            .send({
                name: 'Feijao',
                cost: 15.5,
                sale: 20.5,
                quantity: 50,
                unity:'Unidade',
                min: 30
            })

        expect(res.body).not.toHaveProperty('edited_product')
        expect(res.body).toHaveProperty('message')
        expect(res.statusCode).toBe(400)
    })

    it('Editar produto com campos vazios', async () => {
        const id_product1 = objects.product1._id
        const res = await request(app).put(`/product/api/${id_product1}`)
            .set({ Authorization: token })
            .send({
                cost: 15.5,
                sale: 20.5,
                unity:'Unidade',
                min: 30
            })

        expect(res.body).not.toHaveProperty('edited_product')
        expect(res.body).toHaveProperty('message')
        expect(res.statusCode).toBe(400)
    })

    it('Editar produto com campos inválidos', async () => {
        const id_product1 = objects.product1._id
        const res = await request(app).put(`/product/api/${id_product1}`)
            .set({ Authorization: token })
            .send({
                name: 'Feijao',
                cost: 'abcdef',
                sale: 'abcdef',
                quantity: 50,
                unity:'Unidade',
                min: 30
            })

        expect(res.body).not.toHaveProperty('edited_product')
        expect(res.body).toHaveProperty('message')
        expect(res.statusCode).toBe(400)
    })

    it('Get em todos os produtos da loja', async () => {
        const res = await request(app).get('/product/api')
            .set({ Authorization: token })

        expect(res.body).toHaveProperty('products')
        expect(res.body.products.length).toBe(4)
        expect(res.statusCode).toBe(200)
    })

    it('Get em todos os produtos da loja com paginação', async () => {
        let res = await request(app).get(`/product/api/${1}/${2}`)
            .set({ Authorization: token })

        expect(res.body).toHaveProperty('products')
        expect(res.body.products.length).toBe(2)

        res = await request(app).get(`/product/api/${2}/${2}`)
            .set({ Authorization: token })

        expect(res.body).toHaveProperty('products')
        expect(res.body.products.length).toBe(2)
        expect(res.statusCode).toBe(200)
    })

    it('Get de produtos por nome', async () => {
        const name = 'ket'
        const res = await request(app).get(`/product/api/${name}`)
            .set({ Authorization: token })

        expect(res.body).toHaveProperty('products')
        expect(res.body.products.length).toBe(2)
        expect(res.statusCode).toBe(200)
    })

    it('Get de produtos por nome com paginação', async () => {
        const name = 'ket'
        let res = await request(app).get(`/product/api/name/${name}/${1}/${1}`)
            .set({ Authorization: token })

        expect(res.body).toHaveProperty('products')
        expect(res.body.products.length).toBe(1)

        res = await request(app).get(`/product/api/name/${name}/${2}/${1}`)
            .set({ Authorization: token })

        expect(res.body).toHaveProperty('products')
        expect(res.body.products.length).toBe(1)
        expect(res.statusCode).toBe(200)
    })

    it('Get de produtos abaixo do estoque mínimo', async () => {
        const res = await request(app).get(`/product/api/less/than/min`)
            .set({ Authorization: token })

        expect(res.body).toHaveProperty('products')
        expect(res.body.products.length).toBe(2)
        expect(res.body.products[0].name).toBe('Feijao')
        expect(res.body.products[1].name).toBe('Refrigerante')
        expect(res.statusCode).toBe(200)
    })

    it('Exclusão de produto por id', async () => {
        const id_product2 = objects.product2._id
        const res = await request(app).delete(`/product/api/${id_product2}`)
            .set({ Authorization: token })
    
        const product = await Store.findOne({ name: 'Feijao' })
        expect(product).toBe(null)
        expect(res.statusCode).toBe(200)
    })
})
