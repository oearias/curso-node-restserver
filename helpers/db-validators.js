const Role = require('../models/role');
const User = require('../models/user');


const isValidRole = async (role = '') => {
    const existeRole = await Role.findOne({ role });

    if (!existeRole) {
        throw new Error(`El rol ${role} no está registrado en la BD`);
    }
}


const emailExists = async (email = '') => {
    const existeEmail = await User.findOne({ email });

    if (existeEmail) {
        throw new Error(`El correo: ${email} ya se encuentra registrado `);
    }
}

const userByIdExists = async (id = '') => {
    const existeUsuario = await User.findById( id );

    if (!existeUsuario) {
        throw new Error(`El id: ${id} no existe `);
    }
}

module.exports = {
    isValidRole, emailExists, userByIdExists
}