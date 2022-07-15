const request = require('supertest')
const app = require('../routes')
const mongoose = require('mongoose')
require('../models/Product')
require('../models/Store')
const Store = mongoose.model('stores')
const Product = mongoose.model('products')
const seed = require('./seeds')

describe('Testes nas rotas relacionadas a produtos', () => {
    let token
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost/sisvefake') // Conectando a um banco de dados fake para os testes.
        await Store.deleteMany({})
        await Product.deleteMany({})
        await seed()

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
    })

    it('Cadastrar produto com parâmetros inválidos', async () => {
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
    })
})
