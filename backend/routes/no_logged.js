const express = require('express')
const router = express.Router()

function generate_token(params = {}) {
    const token = jwt.sign(params, auth_config.secret, {
        expiresIn: 86400 // 1 dia.
    })
    return token
}

// Autenticação após efetuar login.
router.post('/authenticate', async (req, res) => {
    const {username, password} = req.body

    const store = await Store.findOne({username}).select('+password')

    if(!store) {
        return res.json('Usuário não existente.')
    }

    if(!await bcrypt.compare(password, store.password)) {
        return res.json('Senha incorreta.')
    }

    store.password = undefined // Para não mostrar no json. Não muda no banco de dados pois não deu .save(). 

    // const token = jwt.sign({id: store._id}, auth_config.secret, {
    //     expiresIn: 86400
    // })

    res.json({
        store, 
        token: generate_token({id: store._id})
    })
})

// Rota para efetuar cadastro.
router.post('/api', (req, res) => {
    const username = req.body.username
    
    Store.findOne({username: username})
        .then(store => {
            if(store) {
                return res.json('Usuário já existente.')
            }

            const new_store = new Store({
                name: req.body.name,
                username: req.body.username,
                password: req.body.password,
                admin_password: req.body.admin_password
            })
            
            new_store.save()
                .then(() => {
                    res.json({
                        new_store,
                        token: generate_token({id: new_store._id}), // Enviando token para já entrar na conta após cadastrar.
                        message: "Loja cadastrada com sucesso!"
                    })
                })
                .catch(err => res.json('Erro ao cadastrar loja.'))
        })
        .catch(err => res.json('Erro ao cadastrar loja.'))
})
