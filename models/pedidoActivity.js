const {Schema, model} = require('mongoose');

const PedidoactivitySchema = Schema({

    actividad: {
        type: String
    },

    fecha : {
        type: Date,
        default: Date.now,
        required: true
    },

    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

});

PedidoactivitySchema.methods.toJSON = function(){
    const{ __v, ...data } = this.toObject();
    return data;
}

module.exports = model( 'PedidoActivity', PedidoactivitySchema );