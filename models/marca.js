const {Schema, model} = require('mongoose');

const MarcaSchema = Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },

    status : {
        type: Boolean,
        default: true,
        required: true
    }
    
});

MarcaSchema.methods.toJSON = function(){
    const{ __v, status, ...data } = this.toObject();
    return data;
}

module.exports = model( 'Marca', MarcaSchema );