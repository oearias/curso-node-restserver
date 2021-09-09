const {Schema, model} = require('mongoose');

const AdressSchema = Schema({

    calle: {
        type: String,
        required: [true, 'La calle es obligatorio']
    },

    numero: {
        type: String,
        required: [true, 'El numero es obligatorio']
    },

    cp: {
        type: String,
        required: [true, 'El cp es obligatorio']
    },

    colonia: {
        type: String,
        required: [true, 'La colonia es obligatorio']
    },

    ciudad: {
        type: String,
        required: [true, 'La ciudad es obligatorio']
    },

    estado: {
        type: String,
        required: [true, 'El estado es obligatorio']
    },

    referencia: {
        type: String,
    },

    preferred: {
        type: Boolean,
        default: false
    }

});

module.exports = model( 'Adress', AdressSchema );