const { response } = require('express');
const { ObjectId } = require('mongoose').Types;
const { User, Category, Product, Client } = require('../models');

const coleccionesPermitidas = [
    'users',
    'clients',
    'categories',
    'products',
    'productsByCategory',
    'roles'
]

const buscarUsuarios = async (termino = '', res = response) => {

    const isMongoId = ObjectId.isValid(termino); //true

    if (isMongoId) {
        const user = await User.findById(termino);
        return res.json({
            results: (user) ? [user] : []
        });
    }

    const regex = new RegExp(termino, 'i')

    const users = await User.find(
        {
            $or: [{ nombre: regex }, { email: regex }],
            $and: [{ status: true }]
        }
    );

    res.json({
        results: users
    });
}

const buscarClientes = async (termino = '', res = response) => {

    const isMongoId = ObjectId.isValid(termino); //true

    if (isMongoId) {
        const client = await Client.findById(termino);
        return res.json({
            results: (client) ? [client] : []
        });
    }

    const regex = new RegExp(termino, 'i')

    const clients = await Client.find(
        {
            $or: [{ nombre: regex }, { email: regex }, { rfc: regex }],
            $and: [{ status: true }]
        }
    );

    res.json({
        results: clients
    });
}

const buscarCategorias = async (termino = '', res = response) => {

    const isMongoId = ObjectId.isValid(termino); //true

    if (isMongoId) {
        const category = await Category.findById(termino);
        return res.json({
            results: (category) ? [category] : []
        });
    }

    const regex = new RegExp(termino, 'i')

    const categories = await Category.find(
        {
            nombre: regex,
            status: true
        }
    );

    res.json({
        results: categories
    });
}

const buscarProductos = async (termino = '', res = response) => {

    const isMongoId = ObjectId.isValid(termino); //true

    if (isMongoId) {
        const product = await Product.findById(termino).populate('category', 'nombre');
        return res.json({
            results: (product) ? [product] : []
        });
    }

    const regex = new RegExp(termino, 'i')

    const products = await Product.find(
        {
            nombre: regex,
            status: true
        }
    ).populate('category', 'nombre');

    res.json({
        results: products
    });
}

const buscarProductosPorCategoria = async (termino = '', res = response) => {

    const isMongoId = ObjectId.isValid(termino); //true

    if (isMongoId) {
        const product = await Product.findById(termino).populate('category', 'nombre');
        return res.json({
            results: (product) ? [product] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const categories = await Category.find({
        nombre: regex,
        status: true
    })


    const products = await Product.find(
        {
            $or: [...categories.map(category => ({
                category: category._id
            }))],
            $and: [{ status: true }]
        }
    ).populate('category', 'nombre');

    res.json({
        results: products
    });
}

const buscar = (req, res = response) => {

    const { termino, coleccion } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {

        case 'categories':
            buscarCategorias(termino, res);
            break;

        case 'products':
            buscarProductos(termino, res);
            break;

        case 'productsByCategory':
            buscarProductosPorCategoria(termino, res);
            break;

        case 'users':
            buscarUsuarios(termino, res);
            break;

        case 'clients':
            buscarClientes(termino, res);
            break;

        default:
            res.status(500).json({
                msg: 'Se le olvidó hacer esta búsqueda'
            });
    }
}

module.exports = {
    buscar
}