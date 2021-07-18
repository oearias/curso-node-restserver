const { response } = require("express")

const isAdminRole = (req, res = response, next) => {

    if( !req.user ){
        return res.status(500).json({
            msg: "Se quiere validar el Rol sin validar el token primero"
        })
    }

    const { role, email } = req.user;

    if( role !== 'ADMIN_ROLE' ){
        return res.status(401).json({
            msg: `El usuario ${email} no tiene privilegios suficientes para realizar esta acción`
        })
    }

    next();

}

const hasRole = ( ...roles) => {

    return ( req, res = response, next ) => {

        if( !req.user ){
            return res.status(500).json({
                msg: "Se quiere validar el Rol sin validar el token primero"
            })
        }

    
        if( !roles.includes( req.user.role )  ){
            return res.status(401).json({
                msg: `Se requiere alguno de los siguientes roles: ${roles} para realizar esta acción`
            })
        }

        next();
    }
}

module.exports = {
    isAdminRole, hasRole 
}