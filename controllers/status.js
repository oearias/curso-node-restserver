const { response } = require('express');
const { Status } = require('../models');

const getStatus = async (req, res = response) => {

    const { limite = 10, desde = 0 } = req.query;

    const query = { status: true }   //Este status refiere NO al nombre del status sino al estado en BD

    const [total, status] = await Promise.all([
        Status.countDocuments(query),
        Status.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        status
    });
}

const getStatusS = async (req, res = response) => {

    const { id } = req.params;

    const status = await
        Status.findById(id)

    res.json(status);
}

const createStatus = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const statusDB = await Status.findOne({ nombre });

    if (statusDB) {
        res.status(400).json({
            msg: `El estatus: ${statusDB.nombre} ya existe`
        });
    } else {
        // Generar la data a guardar

        const data = {
            nombre,
            user: req.user._id
        }

        const status = new Status(data);

        await status.save();

        res.status(201).json(status);
    }

}

const updateStatus = async (req, res = response) => {

    const { id } = req.params;

    const { ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();

    const status = await
        Status.findByIdAndUpdate(id, data, { new: true })   //new true: sirve para devolver siempre el documento actualizado

    res.json(status);
}

const deleteStatus = async (req, res = response) => {

    const { id } = req.params;

    /*const status = await Status.findByIdAndUpdate(id,
        { status: false }, { new: true });*/

    const status = await Status.findByIdAndDelete(id);

    res.json({
        msg: "Status Borrado",
        status
    });

}

module.exports = {
    createStatus,
    getStatus,
    getStatusS,
    updateStatus,
    deleteStatus
}