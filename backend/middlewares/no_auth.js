module.exports = (req, res, next) => {
    const auth_header = req.headers.authorization

    if(auth_header != undefined) {
        return res.status(401).json({err: "Proibido acessar esta rota logado."})
    }

    return next()
}
