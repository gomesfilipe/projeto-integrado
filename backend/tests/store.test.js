const request = require('supertest')
const app = require('../routes')
const mongoose = require('mongoose')
require('../models/Store')
const Store = mongoose.model('stores')
    
describe('Testes no CRUD de loja', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost/sisvefake') // Conectando a um banco de dados fake para os testes.
        await Store.deleteMany({})
    })
    
    afterAll(async () => {
        mongoose.connection.close()
    })
    
    let token

    it('Cadastrar loja', async () => {
        const res = await request(app).post('/store/api')
            .send({
                name: 'Loja',
                username: 'loja123',
                password: '123456',
                admin_password: '123456admin'
            })
        
        token = `Bearer ${res.body.token}`

        const store = await Store.findOne({ username: 'loja123' })
        expect(store).not.toBe(null)
        
        expect(res.body).toHaveProperty('new_store')
        expect(res.body).toHaveProperty('token')
        expect(res.body).toHaveProperty('message')
        expect(res.body.new_store.name).toBe('Loja')
        expect(res.body.new_store.username).toBe('loja123')
        expect(res.body).toHaveProperty('message')
    })
    

    it('Cadastrar loja com username já existente', async () => {
        const res = await request(app).post('/store/api')
            .send({
                name: 'Lanchonete',
                username: 'loja123',
                password: '654321',
                admin_password: '654321admin'
            })

        expect(res.body).toHaveProperty('message')
        expect(res.body).not.toHaveProperty('token')
    })

    it('Cadastrar loja com parâmetros vazios', async () => {
        const res = await request(app).post('/store/api')
            .send({
                username: 'loja123',
                password: '654321',
            })
        
        expect(res.body).toHaveProperty('message')
        expect(res.body).not.toHaveProperty('token')
    })

    it('Cadastrar loja com parâmetros inválidos', async () => {
        const res = await request(app).post('/store/api')
            .send({
                name: 'Lanchonete',
                username: 'loj',
                password: '654321',
                admin_password: '65'
            })
    
        expect(res.body).toHaveProperty('message')
        expect(res.body).not.toHaveProperty('token')
    })

    it('Login', async () => {
        const res = await request(app).post('/store/authenticate')
            .send({
                username: 'loja123',
                password: '123456'
            })

            expect(res.body).toHaveProperty('store')
            expect(res.body).toHaveProperty('token')
            expect(res.body).toHaveProperty('message')
            expect(res.body.store.name).toBe('Loja')
            expect(res.body.store.username).toBe('loja123')
            expect(res.body).toHaveProperty('message')
    })

    it('Login com senha incorreta', async () => {
        const res = await request(app).post('/store/authenticate')
            .send({
                username: 'loja123',
                password: 'abcdef'
            })

            expect(res.body).toHaveProperty('message')
            expect(res.body).not.toHaveProperty('token')
    })

    it('Login com usuário não existente', async () => {
        const res = await request(app).post('/store/authenticate')
            .send({
                username: 'loja1234',
                password: '123456'
            })

            expect(res.body).toHaveProperty('message')
            expect(res.body).not.toHaveProperty('token')
    })

    it('Login com campos vazios', async () => {
        const res = await request(app).post('/store/authenticate')
            .send({
                password: '123456'
            })

            expect(res.body).toHaveProperty('message')
            expect(res.body).not.toHaveProperty('token')
    })

    it('Get na própria loja', async () => {
        const res = await request(app).get('/store/api')
            .set({ Authorization: token })

        expect(res.body).toHaveProperty('store')
        expect(res.body.store).toHaveProperty('_id')
        expect(res.body.store).toHaveProperty('name')
        expect(res.body.store).toHaveProperty('username')
        expect(res.body.store).toHaveProperty('products')
        expect(res.body.store).toHaveProperty('sales')
        expect(res.body.store).toHaveProperty('__v')
    })

    it('Editar loja', async () => {
        const res = await request(app).put('/store/api')
            .set({ Authorization: token })
            .send({
                name: 'Supermercado',
                username: 'loja123',
                password: '123456',
                admin_password: '123456admin'
            })

            expect(res.body).toHaveProperty('edited_store')
            expect(res.body).toHaveProperty('message')
            expect(res.body.edited_store).toHaveProperty('_id')
            expect(res.body.edited_store).toHaveProperty('name')
            expect(res.body.edited_store).toHaveProperty('username')
            expect(res.body.edited_store).toHaveProperty('products')
            expect(res.body.edited_store).toHaveProperty('sales')
            expect(res.body.edited_store).toHaveProperty('__v')
            expect(res.body.edited_store.name).toBe('Supermercado')
            expect(res.body.edited_store.username).toBe('loja123')
    })

    it('Editar loja colocando username já existente', async () => {
        const res1 = await request(app).post('/store/api') // Criando segunda loja.
            .send({
                name: 'Mercearia',
                username: 'mercearia123',
                password: '123456789',
                admin_password: '123456789admin'
            })
        
        const res = await request(app).put('/store/api')
            .set({ Authorization: token })
            .send({
                name: 'Supermercado',
                username: 'mercearia123',
                password: '123456',
                admin_password: '123456admin'
            })

            expect(res.body).not.toHaveProperty('edited_store')
            expect(res.body).toHaveProperty('message')
    })

    it('Editar loja com campos vazios', async () => {
        const res = await request(app).put('/store/api')
            .set({ Authorization: token })
            .send({
                username: 'Pastelaria',
                password: '12345678910',
            })

        expect(res.body).not.toHaveProperty('edited_store')
        expect(res.body).toHaveProperty('message')
    })

    it('Bloquear acesso a rota de cadastro quando está autenticado', async () => {
        const res = await request(app).post('/store/api')
            .set({ Authorization: token })

        expect(res.body).toHaveProperty('err')
    })

    it('Bloquear acesso a rota de login quando está autenticado', async () => {
        const res = await request(app).post('/store/authenticate')
            .set({ Authorization: token })

        expect(res.body).toHaveProperty('err')
    })

    it('Deletar loja', async () => {
        const res = await request(app).delete('/store/api')
            .set({ Authorization: token })
        
        const store = await Store.findOne({ username: 'Supermercado' }) // Editou o username pra Supermercado no teste de edição.
        expect(store).toBe(null)
    })
})
