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

describe('Testes nas rotas relacionadas a vendas', () => {
    let token
    let objects
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost/sisvefake_saletests') // Conectando a um banco de dados fake para os testes.
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
    
    it('Cadastrar venda', async () => {
        const res = await request(app).post('/sale/api')
            .set({ Authorization: token })
            .send({
                items: [
                    {
                        id_product: objects.product1._id,
                        quantity: 2
                    },
                    {
                        id_product: objects.product2._id,
                        quantity: 3
                    },
                    {
                        id_product: objects.product3._id,
                        quantity: 4
                    }
                ],
                value: 122.3
            })
        
        expect(res.body).toHaveProperty('new_sale')
        expect(res.body).toHaveProperty('message')
        expect(res.body.new_sale.value).toBe(122.3)
        expect(res.body.new_sale.id_store).toBe(String(objects.store._id))
        expect(res.statusCode).toBe(200)
    })

    it('Cadastrar venda com campos vazios 1', async () => {
        const res = await request(app).post('/sale/api')
            .set({ Authorization: token })
            .send({
                items: [
                    {
                        id_product: objects.product1._id,
                        quantity: 2
                    },
                    {
                        id_product: objects.product2._id,
                        quantity: 3
                    },
                    {
                        id_product: objects.product3._id,
                        quantity: 4
                    }
                ],
            })
        
        expect(res.body).not.toHaveProperty('new_sale')
        expect(res.body).toHaveProperty('message')
        expect(res.statusCode).toBe(400)
    })

    it('Cadastrar venda com campos vazios 2', async () => {
        const res = await request(app).post('/sale/api')
            .set({ Authorization: token })
            .send({
                items: [
                    {
                        id_product: objects.product1._id,
                        quantity: 2
                    },
                    {
                        quantity: 3
                    },
                    {
                        id_product: objects.product3._id,
                    }
                ],
            })
        
        expect(res.body).not.toHaveProperty('new_sale')
        expect(res.body).toHaveProperty('message')
        expect(res.statusCode).toBe(400)
    })

    it('Cadastrar venda com valor inválido', async () => {
        const res = await request(app).post('/sale/api')
            .set({ Authorization: token })
            .send({
                items: [
                    {
                        id_product: objects.product1._id,
                        quantity: 2
                    },
                    {
                        id_product: objects.product2._id,
                        quantity: 3
                    },
                    {
                        id_product: objects.product3._id,
                        quantity: 4
                    }
                ],
                value: 'abcdef'
            })
        
        expect(res.body).not.toHaveProperty('new_sale')
        expect(res.body).toHaveProperty('message')
        expect(res.statusCode).toBe(400)
    })

    it('Cadastrar venda sem itens', async () => {
        const res = await request(app).post('/sale/api')
            .set({ Authorization: token })
            .send({
                items: [],
                value: 99.90
            })
        
        expect(res.body).not.toHaveProperty('new_sale')
        expect(res.body).toHaveProperty('message')
        expect(res.statusCode).toBe(400)
    })

    it('Cadastrar venda com item com quantidade inválida 1', async () => {
        const res = await request(app).post('/sale/api')
            .set({ Authorization: token })
            .send({
                items: [
                    {
                        id_product: objects.product1._id,
                        quantity: -4
                    },
                    {
                        id_product: objects.product2._id,
                        quantity: 3
                    },
                    {
                        id_product: objects.product3._id,
                        quantity: -10
                    }
                ],
                value: 150.50
            })
        
        expect(res.body).not.toHaveProperty('new_sale')
        expect(res.body).toHaveProperty('message')
        expect(res.statusCode).toBe(400)
    })

    it('Cadastrar venda com item com quantidade inválida 2', async () => {
        const res = await request(app).post('/sale/api')
            .set({ Authorization: token })
            .send({
                items: [
                    {
                        id_product: objects.product1._id,
                        quantity: 5
                    },
                    {
                        id_product: objects.product2._id,
                        quantity: 'abcdef'
                    },
                    {
                        id_product: objects.product3._id,
                        quantity: 'abcdef'
                    }
                ],
                value: 150.50
            })
        
        expect(res.body).not.toHaveProperty('new_sale')
        expect(res.body).toHaveProperty('message')
        expect(res.statusCode).toBe(400)
    })

    it('Get vendas da loja', async () => {
        const res = await request(app).get('/sale/api')
            .set({ Authorization: token })
        
        expect(res.body).toHaveProperty('sales')
        expect(res.body.sales.length).toBe(3)
        expect(res.body.sales[0]).toHaveProperty('_id')
        expect(res.body.sales[0]).toHaveProperty('items')
        expect(res.body.sales[0]).toHaveProperty('date')
        expect(res.body.sales[0]).toHaveProperty('value')
        expect(res.body.sales[0]).toHaveProperty('id_store')
        expect(res.body.sales[0]).toHaveProperty('__v')
        expect(res.body.sales[0].id_store).toBe(String(objects.store._id))
        expect(res.statusCode).toBe(200)
    })

    it('Get vendas da loja por período com data inválida', async () => {
        const from_date = '2022-03-01'
        const to_date = 'abcdef'

        const res = await request(app).get(`/sale/api/dates/${from_date}/${to_date}`)
            .set({ Authorization: token })
        
        expect(res.body).not.toHaveProperty('sales')
        expect(res.body).toHaveProperty('message')
        expect(res.statusCode).toBe(400)
    })

    it('Get vendas da loja por período', async () => {
        const from_date = '2022-03-01'
        const to_date = '2022-03-31'

        const res = await request(app).get(`/sale/api/dates/${from_date}/${to_date}`)
            .set({ Authorization: token })
        
        expect(res.body).toHaveProperty('sales')
        expect(res.body.sales.length).toBe(2)

        expect(res.body.sales[0]).toHaveProperty('_id')
        expect(res.body.sales[0]).toHaveProperty('items')
        expect(res.body.sales[0]).toHaveProperty('date')
        expect(res.body.sales[0]).toHaveProperty('value')
        expect(res.body.sales[0]).toHaveProperty('id_store')
        expect(res.body.sales[0]).toHaveProperty('__v')
        expect(res.body.sales[0].id_store).toBe(String(objects.store._id))
        expect(res.body.sales[0].date).toBe(new Date('2022-03-05 00:00:00').toISOString())

        expect(res.body.sales[1]).toHaveProperty('_id')
        expect(res.body.sales[1]).toHaveProperty('items')
        expect(res.body.sales[1]).toHaveProperty('date')
        expect(res.body.sales[1]).toHaveProperty('value')
        expect(res.body.sales[1]).toHaveProperty('id_store')
        expect(res.body.sales[1]).toHaveProperty('__v')
        expect(res.body.sales[1].id_store).toBe(String(objects.store._id))
        expect(res.body.sales[1].date).toBe(new Date('2022-03-20 00:00:00').toISOString())

        expect(res.statusCode).toBe(200)
    })
    
    it('Get dashboards', async () => {
        const from_date = '2022-03-01'
        const to_date = '2022-03-31'
        
        const res = await request(app).get(`/sale/api/dashboards/${from_date}/${to_date}`)
            .set({ Authorization: token })

        expect(res.body).toHaveProperty('sales_quantity')
        expect(res.body).toHaveProperty('sales_billing')
        expect(res.body).not.toHaveProperty('message')
        expect(res.body.sales_quantity).toBe(2)
        expect(res.body.sales_billing).toBe(1100.00)
        expect(res.statusCode).toBe(200)
    })

    it('Get dashboards com data inválida', async () => {
        const from_date = 'abcdef'
        const to_date = '2022-03-31'
        
        const res = await request(app).get(`/sale/api/dashboards/${from_date}/${to_date}`)
            .set({ Authorization: token })

        expect(res.body).not.toHaveProperty('sales_quantity')
        expect(res.body).not.toHaveProperty('sales_billing')
        expect(res.body).toHaveProperty('message')
        expect(res.statusCode).toBe(400)
    })

    it('Exclusão de venda por id', async () => {
        const id_sale1 = objects.sale1._id
        const res = await request(app).delete(`/sale/api/${id_sale1}`)
            .set({ Authorization: token })
        
        for(let i = 0; i < objects.sale1.items.length; i++) {
            const item = await Item.findOne({ _id: objects.sale1.items[i]})
            expect(item).toBe(null)
        }

        const sale = await Sale.findOne({ _id: id_sale1 })
        expect(sale).toBe(null)
        expect(res.statusCode).toBe(200)
    })
})
