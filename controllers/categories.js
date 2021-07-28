const { response } = require('express');
const { Category } = require('../models');

const getCategories = async (req, res = response) => {

    const { limite = 10, desde = 0 } = req.query;

    const query = { status: true }

    const [total, categories] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
            .populate('user', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        categories
    });
}

const getCategory = async (req, res = response) => {

    const { id } = req.params;

    const category = await
        Category.findById(id)
            .populate('user', 'nombre')

    res.json(category);
}

const createCategory = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();


    const categoryDB = await Category.findOne({ nombre });

    if (categoryDB) {
        res.status(400).json({
            msg: `La categoría: ${categoryDB.nombre} ya existe`
        });
    } else {
        // Generar la data a guardar

        const data = {
            nombre,
            user: req.user._id
        }

        const category = new Category(data);

        await category.save();

        res.status(201).json(category);
    }



}

const updateCategory = async (req, res = response) => {

    const { id } = req.params;

    const { status, user, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.user = req.user._id;

    const category = await
        Category.findByIdAndUpdate(id, data, { new: true })   //new true: sirve para devolver siempre el documento actualizado
            .populate('user', 'nombre');

    console.log("id recibido:", id);

    res.json(category);
}

const deleteCategory = async (req, res = response) => {

    const { id } = req.params;

    const category = await Category.findByIdAndUpdate(id,
        { status: false }, { new: true });

    //const userAuntheticated = req.user;

    res.json({
        msg: "Categoría Borrada",
        category
    });

}

module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
}