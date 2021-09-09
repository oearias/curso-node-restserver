const {Schema, model} = require('mongoose');

const NumOrdenSchema = Schema({

    numero: {
        type: Number
    },
});

module.exports = model( 'NumOrden', NumOrdenSchema );