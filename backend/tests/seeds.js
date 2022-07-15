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
    const new_store = new Store({
        name: 'Supermercado seed',
        username: 'super123',
        password: await bcrypt.hash('123456', 10),
        admin_password: await bcrypt.hash('123456admin', 10)
    })
    
    const store = await new_store.save()
    return store
}

const seed_store_products = async () => {
    const store = await seed_store()

    const new_product1 = new Product({
        name: 'Arroz',
        cost: 10.50,
        sale: 20.50,
        quantity: 30,
        unity: 'Pacote',
        id_store: store._id,
        min: 10
    })

    const new_product2 = new Product({
        name: 'Feijao',
        cost: 8.80,
        sale: 15.60,
        quantity: 20,
        unity: 'Pacote',
        id_store: store._id,
        min: 30
    })

    const new_product3 = new Product({
        name: 'Refrigerante',
        cost: 4.00,
        sale: 8.50,
        quantity: 10,
        unity: 'Pacote',
        id_store: store._id,
        min: 15
    })

    const product1 = await new_product1.save()
    const product2 = await new_product2.save()
    const product3 = await new_product3.save()
    return {store, product1, product2, product3}
}

const seed_store_products_items_sales = async () => {  
    const {store, product1, product2, product3} = await seed_store_products()

    const new_item1 = new Item({
        id_product: product1._id,
        id_store: store._id,
        quantity: 1
    })

    const new_item2 = new Item({
        id_product: product2._id,
        id_store: store._id,
        quantity: 2
    })

    const new_item3 = new Item({
        id_product: product3._id,
        id_store: store._id,
        quantity: 3
    })

    const item1 = await new_item1.save()
    const item2 = await new_item2.save()
    const item3 = await new_item3.save()

    const new_sale1 = new Sale({
        items: [
            item1._id,
            item2._id,
            item3._id
        ],
        value: 550.00,
        id_store: store._id,
        date: new Date('2022-03-05 00:00:00')
    })

    const new_sale2 = new Sale({
        items: [
            item1._id,
            item2._id,
            item3._id
        ],
        value: 550.00,
        id_store: store._id,
        date: new Date('2022-03-20 00:00:00')
    })

    const sale1 = await new_sale1.save()
    const sale2 = await new_sale2.save()

    return {store, product1, product2, product3, item1, item2, item3, sale1, sale2}
}

module.exports = seed_store_products_items_sales
