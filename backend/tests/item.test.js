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

describe('Testes nas rotas relacionadas a itens', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost/sisvefake') // Conectando a um banco de dados fake para os testes.
        await Store.deleteMany({})
        await Product.deleteMany({})
        await Sale.deleteMany({})
        await Item.deleteMany({})
    })
    
    afterAll(async () => {
        mongoose.connection.close()
    })
    
    let token
    
    it('.', async () => {
        expect(true).toBe(true)
    })
})
