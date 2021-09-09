
const { response } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validarJWT = async(req, res = response, next) => {


    const token = req.header('x-token');

    if( !token ){
        return res.status(401).json({
            msg: 'No existe token en la petición'
        })
    }

    try {

        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );

        // Leer el usuario que corresponde al UID
        const user = await User.findById( uid ); 

        if( !user ){
            return res.status(401).json({
                msg: 'Token no válido - Usuario inexistente'
            })
        }

        // Verificar status del uid
        if( !user.status ){
            return res.status(401).json({
                msg: 'Token no válido - status: false'
            })
        }

        req.user = user;
        next();

    } catch (error) {

        console.error(error)

        res.status(401).json({
            msg: 'Token no válido, Sesión expirada. Por favor inicie sesión nuevamente'
        })
    }

    

}

module.exports = {
    validarJWT
}