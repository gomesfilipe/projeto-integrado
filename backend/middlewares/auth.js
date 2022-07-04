const jwt = require('jsonwebtoken')
const auth_config = require('../config/auth.json')

module.exports = (req, res, next) => {
    const auth_header = req.headers.authorization
    
    if(!auth_header) {
        return res.status(401).json({err: "Token não fornecido."})
    }

    const parts = auth_header.split(' ')
    if(!(parts.length === 2)) {
        return res.status(401).json({err: "Token inválido."})
    }
    
    const [scheme, token] = parts
    
    if(!(/^(Bearer)$/i.test(scheme))) {
        return res.status(401).json({err: "Token mal-formatado."})
    }

    jwt.verify(token, auth_config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({err: 'Token inválido.'})
        }

        req.store_id = decoded.id
    })

    return next()
}
