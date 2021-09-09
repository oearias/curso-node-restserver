
const { response } = require('express');
//const bcryptjs = require('bcryptjs');

const Client = require('../models/client');


const clientsGet = async(req, res = response) => {

    const { limite = 100, desde = 0 } = req.query;

    const query = {status: true}

    //Estas dos promesas funcionan pero toman el doble de tiempo debido al await, termina una y empieza otra
    /*const users = await User.find(query)
        .skip(Number(desde))
        .limit(Number(limite));

    const total = await User.countDocuments(query);*/

    //lo que hacemos en su lugar es un arreglo de promesas

    const [total, clients] = await Promise.all([
        Client.countDocuments(query),
        Client.find(query)
            .skip(Number(desde))
            .limit(Number(limite))

    ])

    res.json({
        total,
        clients
    });
}

const clientGet = async (req, res = response) => {

    const { id } = req.params;

    const client = await
        Client.findById(id);

    res.json(client);
}

const clientsPost = async (req, res) => {

    const { nombre, apellido, telefono, email, username, role, ...body} = req.body;
    const fullname = nombre+' '+apellido;

    let rfc;

    if(body.rfc){
        rfc = body.rfc.toUpperCase();
    }
    
    if(!body.rfc){
        rfc = "S/R"
    }

    const client = new Client({ nombre, apellido, telefono, rfc, fullname, username, email, role });

    // Encriptar password
    //const salt = bcryptjs.genSaltSync();
    //user.password = bcryptjs.hashSync(password, salt);

    // Guardar en BD
    await client.save();

    res.json({
        msg: 'post API - controlador',
        client
    });
}

const clientsPut = async(req, res) => {

    const { id } = req.params;

    const { _id, google, email, ...resto } = req.body;

    resto.email = email;
    
    let rfc = req.body.rfc.toUpperCase();

    resto.fullname = resto.nombre+' '+resto.apellido; 
    resto.rfc = rfc;

    // TODO validar contra base de datos
    /*if (password) {
        // Encriptar password, esta función se repite así que se puede hacer con un Helper...
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }*/

    const client = await Client.findByIdAndUpdate(id, resto, { new: true })

    console.log("id recibido:", id);

    res.json(client);
}

const clientsDelete = async(req, res) => {

    const { id } = req.params;

    const client = await Client.findByIdAndUpdate( id, {status:false});

    //const userAuntheticated = req.user;

    res.json({
        msg: "Cliente Borrado",
        client});
}

module.exports = {
    clientsGet,
    clientGet,
    clientsPost,
    clientsPut,
    clientsDelete
}