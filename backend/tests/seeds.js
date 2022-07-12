const mongoose = require('mongoose')
require('../models/Product')
require('../models/Store')
require('../models/Sale')
require('../models/Item')
const Store = mongoose.model('stores')
const Product = mongoose.model('products')
const Sale = mongoose.model('sales')
const Item = mongoose.model('items')

const seed_store = async () => {
    const store = new Store({
        name: 'Supermercado',
        username: 'super123',
        password: '123456',
        admin_password: '123456admin'
    })
    
    await store.save()
    return store
}

const seed_store_products = async () => {
    const store = await seed_store()

    const product1 = new Product({
        name: 'Arroz',
        cost: 10.50,
        sale: 20.50,
        quantity: 30,
        unity: 'Pacote',
        id_store: store.id_store,
        min: 10
    })

    const product2 = new Product({
        name: 'Feijao',
        cost: 8.80,
        sale: 15.60,
        quantity: 70,
        unity: 'Pacote',
        id_store: store.id_store,
        min: 30
    })

    const product3 = new Product({
        name: 'Refrigerante',
        cost: 4.00,
        sale: 8.50,
        quantity: 25,
        unity: 'Pacote',
        id_store: store.id_store,
        min: 15
    })

    await product1.save()
    await product2.save()
    await product3.save()
    return {store, product1, product2, product3}
}

const seed_store_products_sales = async () => {  
    ({store, product1, product2, product3} = await seed_store_products()) // Ver jeito certo de fazer.
}
