const request = require('supertest')
const app = require('../routes')

const mongoose = require('mongoose')

// Configuração mongoose.
// mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/sisve')
    .then(() => console.log('Connected database!'))
    .catch(() => console.log('Error to connect database.'))

// it('Efetuar login', async () => {

// })

describe('Testes no CRUD de loja', () => {
    it('Cadastrar loja', async () => {
        try {
            const res = await request(app).post('/nologged/api')
                .send({
                    name: 'Supermercado Carrinho Cheio',
                    username: 'supermercado!!',
                    password: '123456',
                    admin_password: '123456'
                })
            
                expect(res.body).toHaveProperty('token')
        } catch(err) {
            console.error('Erro Cadastrar loja:'+err)
        }
    })
    
    // it('Deletar loja', async () => {
    //     try {
    //         const res1 = await request(app).get('')
    //         const res2 = await request(app).delete('/')
    //     } catch(err) {
    //         console.error('Erro Deletar loja:'+err)
    //     }
    // })

})

