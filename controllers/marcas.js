const { response } = require('express');
const { Marca } = require('../models');

const getMarcas = async (req, res = response) => {

    const { limite = 100, desde = 0 } = req.query;

    const query = { status: true}

    const [total, marcas] = await Promise.all([
        Marca.countDocuments(query),
        Marca.find(query)
            .sort('nombre')
            //.skip(Number(desde))
            //.limit(Number(limite))
    ])

    res.json({
        total,
        marcas
    });
}

const getMarca = async (req, res = response) => {

    const { id } = req.params;

    const marca = await
        Marca.findById(id)
            .populate('user', 'nombre')

    res.json(marca);
}

const createMarca = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();


    const marcaDB = await Marca.findOne({ nombre });

    if (marcaDB) {
        res.status(400).json({
            msg: `La marca: ${marcaDB.nombre} ya existe`
        });
    } else {
        // Generar la data a guardar

        const data = {
            nombre,
            user: req.user._id
        }

        const marca = new Marca(data);

        await marca.save();

        res.status(201).json(marca);
    }

}

const updateMarca = async (req, res = response) => {

    const { id } = req.params;

    const { status, user, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.user = req.user._id;

    const marca = await
        Marca.findByIdAndUpdate(id, data, { new: true })   //new true: sirve para devolver siempre el documento actualizado
            .populate('user', 'nombre');

    console.log("id recibido:", id);

    res.json(marca);
}

const deleteMarca = async (req, res = response) => {

    const { id } = req.params;

    const marca = await Marca.findByIdAndDelete(id);

    //const userAuntheticated = req.user;

    res.json({
        msg: "Marca Borrada",
        marca
    });

}

module.exports = {
    createMarca,
    getMarcas,
    getMarca,
    updateMarca,
    deleteMarca
}