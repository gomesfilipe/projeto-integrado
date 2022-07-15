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

describe('Testes nas rotas relacionadas a itens', () => {
    let token
    let objects
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost/sisvefake_itemtests') // Conectando a um banco de dados fake para os testes.
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
    
    it('Get itens da loja', async () => {
        const res = await request(app).get('/item/api')
            .set({ Authorization: token })

        expect(res.body).toHaveProperty('items')
        expect(res.body.items.length).toBe(3)
        expect(res.body.items[0].id_product).toBe(objects.item1.id_product)
        expect(res.body.items[1].id_product).toBe(objects.item2.id_product)
        expect(res.body.items[2].id_product).toBe(objects.item3.id_product)
        expect(res.body.items[0].id_store).toBe(objects.item1.id_store)
        expect(res.body.items[1].id_store).toBe(objects.item2.id_store)
        expect(res.body.items[2].id_store).toBe(objects.item3.id_store)
        expect(res.statusCode).toBe(200)
    })
})
