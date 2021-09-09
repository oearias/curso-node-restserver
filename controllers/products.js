const { response } = require('express');
const { mongoose } = require('mongoose');

const { productByIdExists } = require('../helpers/db-validators');
const { Product} = require('../models');

const getProducts = async (req, res = response) => {

    //params de query
    const { limite = 100, desde = 0 } = req.query;

    const query = { status: true }

    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .populate('user', 'username')
            .populate('category', 'nombre')
            .populate('subcategory', 'nombre')
            .populate('marca', 'nombre')
            //.skip(Number(desde))
            //.limit(Number(limite))
    ])

    res.json({
        total,
        products
    });
}

const getProduct = async (req, res = response) => {

    const { id } = req.params;

    const product = await
        Product.findById(id)
            .populate('user', 'username')
            .populate('marca', 'nombre')
            .populate('category', 'nombre')
            .populate('subcategory', 'nombre')

    res.json(product);
}

const createProduct = async (req, res = response) => {

    // Validar que el id de la cateogría sea valido

    const { status, user, ...body } = req.body;

    const nombre = body.nombre.toUpperCase();

    const productDB = await Product.findOne({ nombre });

    if (productDB) {
        res.status(400).json({
            msg: `El producto: ${productDB.nombre} ya existe`
        });
    } else {
        // Generar la data a guardar

        const data = {
            ...body,
            nombre,
            user: req.user._id
        }

        const product = new Product(data);

        await product.save();

        res.status(201).json(product);
    }

}

const updateProduct = async (req, res = response) => {

    const { id } = req.params;

    const { status, user, ...data } = req.body;


    // Solo si viene el nombre capitalizamos
    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }

    data.user = req.user._id;

    const product = await
        Product.findByIdAndUpdate(id, data, { new: true })   //new true: sirve para devolver siempre el documento actualizado
            .populate('user', 'nombre');

    console.log("id recibido:", id);

    res.json(product);
}

const deleteProduct = async (req, res = response) => {

    const { id } = req.params;

    //const product = await Product.findByIdAndDelete(id);

    const product = await Product.findByIdAndUpdate(id, {status: false})

    //const userAuntheticated = req.user;

    res.json({
        msg: "Producto Borrado",
        product
    });

}

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
}