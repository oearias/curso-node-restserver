const {Schema, model} = require('mongoose');

const OrderDetailSchema = Schema({

    cantidad: {
        type: Number
    },

    subtotal: {
        type: Number
    },

    producto: {
        type: Schema.Types.ObjectId,
        ref: 'Producto',
    },

    order: [{
        type: Schema.Types.ObjectId,
        ref: 'Order'
     }]

});

module.exports = model( 'OrderDetail', OrderDetailSchema );