const {Schema, model} = require('mongoose');

const SubcategorySchema = Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },

    status : {
        type: Boolean,
        default: true,
        required: true
    },

    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }

});

SubcategorySchema.methods.toJSON = function(){
    const{ __v, status, ...data } = this.toObject();
    return data;
}

module.exports = model( 'Subcategory', SubcategorySchema );