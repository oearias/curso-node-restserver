const { Category, Product, Role, User } = require('../models');


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
    const existeUsuario = await User.findById(id);

    if (!existeUsuario) {
        throw new Error(`El id: ${id} no existe `);
    }
}

const categoryByIdExists = async (id = '') => {
    const existeCategoria = await Category.findById(id);

    if (!existeCategoria) {
        throw new Error(`El id: ${id} de la categoría no existe `)
    }
}

const productByIdExists = async (id = '') => {
    const existeProducto = await Product.findById(id);

    if (!existeProducto) {
        throw new Error(`El id: ${id} del producto no existe `)
    }
}

module.exports = {
    isValidRole, emailExists, userByIdExists, categoryByIdExists, productByIdExists
}