const { Category, Product, Role, User, Marca, Subcategory, Status, Order, Numorder, Pedidoactivity, Client } = require('../models');


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

const emailExistsC = async (email = '') => {
    const existeEmail = await Client.findOne({ email });

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

const clientByIdExists = async (id = '') => {
    const existeCliente = await Client.findById(id);

    if (!existeCliente) {
        throw new Error(`El id: ${id} no existe `);
    }
}

const categoryByIdExists = async (id = '') => {
    const existeCategoria = await Category.findById(id);

    if (!existeCategoria) {
        throw new Error(`El id: ${id} de la categoría no existe `)
    }
}

const subcategoryByIdExists = async (id = '') => {
    const existeSubcategoria = await Subcategory.findById(id);

    if (!existeSubcategoria) {
        throw new Error(`El id: ${id} de la subcategoría no existe `)
    }
}

const brandByIdExists = async (id = '') => {
    const existeMarca = await Marca.findById(id);

    if (!existeMarca) {
        throw new Error(`El id: ${id} de la marca no existe `)
    }
}

const productByIdExists = async (id = '') => {
    const existeProducto = await Product.findById(id);

    if (!existeProducto) {
        throw new Error(`El id: ${id} del producto no existe `)
    }

}

const orderByIdExists = async (id = '') => {
    const existeOrden = await Order.findById(id);

    if (!existeOrden) {
        throw new Error(`El id: ${id} de la orden no existe `)
    }
}

const activityByIdExists = async (id = '') => {
    const existeAct = await Pedidoactivity.findById(id);

    if (!existeAct) {
        throw new Error(`El id: ${id} de la actividad no existe `)
    }
}

const coleccionesPermitidas = ( coleccion = '', colecciones = []) => {

    const included = colecciones.includes(coleccion);

    if( !included ){
        throw new Error(`La coleccion ${coleccion} no es permitida, por favor usar solo: ${colecciones}`)
    }

    return true;
}

const generaNumOrden = async() => {

    let numOrden;

    const ultimo = await Numorder.find().sort({$natural:-1}).limit(1);

    if(ultimo.length > 0){
        numOrden = Number(ultimo[0].numero + 1);
    }else{
        numOrden = 1
    }


    return Number(numOrden);

}

const statusByIdExists = async (id = '') => { 

    const existeStatus = await Status.findById(id);

    if (!existeStatus) {
        throw new Error(`El id: ${id} del status no existe `)
    }
}

module.exports = {
    isValidRole, 
    emailExists, 
    emailExistsC,
    brandByIdExists, 
    categoryByIdExists, 
    clientByIdExists,
    orderByIdExists,
    productByIdExists,
    subcategoryByIdExists,
    statusByIdExists,
    userByIdExists, 
    activityByIdExists,
    coleccionesPermitidas,
    generaNumOrden
}