const { response } = require('express');
const { Pedidoactivity } = require('../models');

const getPedidoActivities = async (req, res = response) => {

    const { limite = 10, desde = 0 } = req.query;

    const query = { }

    const [total, pedidosActivities] = await Promise.all([
        Pedidoactivity.countDocuments(query),
        Pedidoactivity.find(query)
            .populate('user', 'fullname')
    ])

    res.json({
        total,
        pedidosActivities
    });
}

const getPedidoActivity = async (req, res = response) => {

    const { id } = req.params;

    const actividad = await
        Pedidoactivity.findById(id)
            .populate('user', 'nombre')
            .populate('order', 'numOrden')

    res.json(actividad);
}

const createPedidoActivity = async (req, res = response) => {

    const { actividad, fecha, order } = req.body;

    // Generar la data a guardar
    const data = {
        actividad,
        fecha,
        order,
        user: req.user._id
    }

    const activity = new Pedidoactivity(data);

    await activity.save();

    res.status(201).json(activity);

}

const updatePedidoActivity = async (req, res = response) => {

    const { id } = req.params;

    const { ...data } = req.body;

    data.user = req.user._id;

    const activity = await
        Pedidoactivity.findByIdAndUpdate(id, data, { new: true })   //new true: sirve para devolver siempre el documento actualizado
            .populate('order', 'numOrden')
            .populate('user', 'fullname');


    res.json(activity);
}

const deletePedidoActivity = async (req, res = response) => {

    const { id } = req.params;

    const activity = await Pedidoactivity.findByIdAndDelete(id);

    //const userAuntheticated = req.user;

    res.json({
        msg: "Actividad Borrada",
        activity
    });

}

module.exports = {
    createPedidoActivity,
    getPedidoActivity,
    getPedidoActivities,
    updatePedidoActivity,
    deletePedidoActivity
}