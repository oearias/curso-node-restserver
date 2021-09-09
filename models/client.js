
const { Schema, model } = require('mongoose');

const ClientSchema = Schema({
    
    nombre: {
        type: String,
        required: [true, 'El nombre es obigatorio']
    },

    apellido: {
        type: String
    },

    email: {
        type: String,
        required: [true, 'El email es obigatorio'],
        unique: true
    },

    fullname: {
        type: String,
    },

    rfc: {
        type: String,
        unique: true
    },

    adress: {
        type: Schema.Types.ObjectId,
        ref: 'Adress',
    },

    telefono: {
        type: Number,
    },

    /*password: {
        type: String,
        //required: [true, 'La contraseña es obigatoria']
    },*/

    img: {
        type: String
    },

    role: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        emun: ['ADMIN_ROLE','USER_ROLE']
    },

    status: {
        type: Boolean,
        default: true
    },

    google: {
        type: Boolean,
        default: false
    },

    createdDate: {
        type: String
    }
});

ClientSchema.methods.toJSON = function(){
    const{ __v, password, _id, ...cliente } = this.toObject();
    cliente.uid = _id;
    return cliente;
}

module.exports = model( 'Client', ClientSchema );