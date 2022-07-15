const mongoose = require('mongoose')
require('../models/Product')
require('../models/Store')
require('../models/Sale')
require('../models/Item')
const Store = mongoose.model('stores')
const Product = mongoose.model('products')
const Sale = mongoose.model('sales')
const Item = mongoose.model('items')
const bcrypt = require('bcryptjs')

const seed_store = async () => {
    const store = new Store({
        name: 'Supermercado seed',
        username: 'super123',
        password: await bcrypt.hash('123456', 10),
        admin_password: await bcrypt.hash('123456admin', 10)
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
        id_store: store._id,
        min: 10
    })

    const product2 = new Product({
        name: 'Feijao',
        cost: 8.80,
        sale: 15.60,
        quantity: 70,
        unity: 'Pacote',
        id_store: store._id,
        min: 30
    })

    const product3 = new Product({
        name: 'Refrigerante',
        cost: 4.00,
        sale: 8.50,
        quantity: 25,
        unity: 'Pacote',
        id_store: store._id,
        min: 15
    })

    await product1.save()
    await product2.save()
    await product3.save()
    return {store, product1, product2, product3}
}

const seed_store_products_items = async () => {  
    const {store, product1, product2, product3} = await seed_store_products()

    const item1 = new Item({
        id_product: product1._id,
        id_store: store._id,
        quantity: 1
    })

    const item2 = new Item({
        id_product: product2._id,
        id_store: store._id,
        quantity: 2
    })

    const item3 = new Item({
        id_product: product3._id,
        id_store: store._id,
        quantity: 3
    })

    await item1.save()
    await item2.save()
    await item3.save()
    return {store, product1, product2, product3, item1, item2, item3}
}

module.exports = seed_store_products_items
