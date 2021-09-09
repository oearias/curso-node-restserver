const { response } = require('express');
const { Subcategory } = require('../models');

const getSubcategories = async (req, res = response) => {

    const { limite = 10, desde = 0 } = req.query;

    const query = { status: true }

    const [total, subcategories] = await Promise.all([
        Subcategory.countDocuments(query),
        Subcategory.find(query)
            //.populate('category','nombre')  //con esta forma NO se excluye el _id
            .populate({path:'category', select:'nombre -_id'})  //con esta forma se excluye el _id
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        subcategories
    });
}

const getSubcategory = async (req, res = response) => {

    const { id } = req.params;

    const subcategory = await
        Subcategory.findById(id)
            .populate('category', 'nombre')

    res.json(subcategory);
}

const createSubcategory = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();
    const {category} = req.body;

    const subcategoryDB = await Subcategory.findOne({ nombre });

    if (subcategoryDB) {
        res.status(400).json({
            msg: `La subcategoría: ${subcategoryDB.nombre} ya existe`
        });
    } else {

        const data = {
            nombre,
            category,
            user: req.user._id
        }

        const subcategory = new Subcategory(data);

        await subcategory.save();

        res.status(201).json(subcategory);
    }



}

const updateSubcategory = async (req, res = response) => {

    const { id } = req.params;

    const { status, user, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.user = req.user._id;

    const subcategory = await
        Subcategory.findByIdAndUpdate(id, data, { new: true })   //new true: sirve para devolver siempre el documento actualizado
            .populate('category','nombre')
            .populate('user', 'username');

    res.json(subcategory);
}

const deleteSubcategory = async (req, res = response) => {

    const { id } = req.params;

    const subcategory = await Subcategory.findByIdAndDelete(id);

    //const userAuntheticated = req.user;

    res.json({
        msg: "Sub-Categoría Borrada",
        subcategory
    });

}

module.exports = {
    createSubcategory,
    getSubcategories,
    getSubcategory,
    updateSubcategory,
    deleteSubcategory
}