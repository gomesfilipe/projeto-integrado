const request = require('supertest')
const app = require('../routes')
const mongoose = require('mongoose')
require('../models/Product')
require('../models/Store')
const Store = mongoose.model('stores')
const Product = mongoose.model('products')

describe('Testes nas rotas relacionadas a produtos', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost/sisvefake') // Conectando a um banco de dados fake para os testes.
        await Store.deleteMany({})
        await Product.deleteMany({})
    })
    
    afterAll(async () => {
        mongoose.connection.close()
    })
    
    let token
    
    it('.', async () => {
        expect(true).toBe(true)
    })
})
