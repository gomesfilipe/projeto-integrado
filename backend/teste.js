// var vetor = ['a', 'b', 'c', 'd']

// var index = vetor.indexOf('d')

// console.log(index)

// vetor.splice(index, 1)

// console.log(vetor)


const mongoose = require('mongoose')
require('./models/Product')
require('./models/Store')
require('./models/Sale')
require('./models/Item')
const Store = mongoose.model('stores')
const Product = mongoose.model('products')
const Sale = mongoose.model('sales')
const Item = mongoose.model('items')
const seed = require('./tests/seeds')

const x = async () => {
    console.log('inicio')
    await mongoose.connect('mongodb://localhost/sisvefake')
    await Store.deleteMany({})
    await Product.deleteMany({})
    await Sale.deleteMany({})
    await Item.deleteMany({})
    await seed()
    await mongoose.connection.close()
    console.log('fim')
}

x()




// var date = new Date()

// console.log(date)
// console.log(date.toISOString())
// var date2 = new Date('2021-02-30 00:00:00')
// console.log(date2.toISOString())

// console.log('dia: ' + date2.getDate())
// console.log('mes: ' + date2.getMonth())
// console.log('ano: ' + date2.getFullYear())

// if(date2 == 'Invalid Date') {
//     console.log('data invalida')
// } else{
//     console.log('data valida')
// }

// console.log(date2.getMonth())

// var vetor = [{nome: 'teste'},{nome: 'testando'}]
// console.log(typeof(vetor))

// if(null) {
//     console.log('entrou')
// } else {
//     console.log('nao entrou')
// }

// console.log(isNaN('1'))
// console.log(isNaN('-1'))
// console.log(isNaN('-1.3'))
// console.log(isNaN('1.5'))
// console.log(isNaN('a'))
