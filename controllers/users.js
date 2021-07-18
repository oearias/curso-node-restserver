
const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');


const usersGet = async(req, res = response) => {

    const { limite = 10, desde = 0 } = req.query;

    const query = {status: true}

    //Estas dos promesas funcionan pero toman el doble de tiempo debido al await, termina una y empieza otra
    /*const users = await User.find(query)
        .skip(Number(desde))
        .limit(Number(limite));

    const total = await User.countDocuments(query);*/

    //lo que hacemos en su lugar es un arreglo de promesas

    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        users
    });
}

const usersPost = async (req, res) => {

    const { nombre, email, password, role } = req.body;
    const user = new User({ nombre, email, password, role });

    // Encriptar password
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    // Guardar en BD
    await user.save();

    res.json({
        msg: 'post API - controlador',
        user
    });
}

const usersPut = async(req, res) => {

    const { id } = req.params;
    const { _id, password, google, email, ...resto } = req.body;

    // TODO validar contra base de datos
    if (password) {
        // Encriptar password, esta función se repite así que se puede hacer con un Helper...
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, resto)

    console.log("id recibido:", id);

    res.json(user);
}

const usersDelete = async(req, res) => {

    const { id } = req.params;

    const user = await User.findByIdAndUpdate( id, {status:false});

    //const userAuntheticated = req.user;

    res.json({
        msg: "Usuario Borrado",
        user});
}

const usersPatch = (req, res) => {
    res.json({
        msg: 'patch API - controlador'
    });
}

module.exports = {
    usersGet,
    usersPost,
    usersPut,
    usersDelete,
    usersPatch
}