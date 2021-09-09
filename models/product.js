const {Schema, model} = require('mongoose');

const ProductSchema = Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },

    sku: {
        type: String,
    },

    status : {
        type: Boolean,
        default: true,
        required: true
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    cantidad:{
        type: Number,
        default: 0
    },

    oferta: {
        type: Number,
        default: 0
    },

    ofetaEnabled: {
        type: Boolean,
        default: false
    },

    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },

    marca: {
        type: Schema.Types.ObjectId,
        ref: 'Marca',
        required: true
    },

    descripcion: {
        type: String
    },

    stock: {
        type: Number,
        default: 0
    },

    precio: {
        type: Number,
        default: 0
    },

    costo: {
        type: Number,
        default: 0
    },

    talla: {
        type: String
    },

    color: {
        type: String
    },

    vendido: {
        type: Number
    },

    img: {
        type: String
    }
});

ProductSchema.methods.toJSON = function(){
    const{ __v, status, ...data } = this.toObject();
    return data;
}

module.exports = model( 'Product', ProductSchema );