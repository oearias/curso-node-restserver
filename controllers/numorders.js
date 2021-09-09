const { response } = require('express');
const { Numorder } = require('../models');

const createNumOrder = async (req, res = response) => {

    const {numero} = req.body;

    const numeroDB = await Numorder.findOne({ numero });

    if (numeroDB) {
        res.status(400).json({
            msg: `El número de orden: ${marcaDB.nombre} ya existe`
        });
    } else {
        // Generar la data a guardar

        const data = {
            numero
        }

        const numNew = new Numorder(data);

        await numNew.save();

        res.status(201).json(numNew);
    }

}



module.exports = {
    createNumOrder
}