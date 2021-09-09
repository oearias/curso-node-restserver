
const {Schema, model} = require('mongoose');

const OrderSchema = Schema({

    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'Client',   //Checar si es cliente o usuario ????? TODOOOOO
        required: true
    },

    numOrden: {
        type: Number
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    total: {
        type: Number
    },

    orderDetail : [{
        productos : {
            type: Schema.Types.ObjectId,
            ref:'Product'
        },

        descripcion: {
            type: String
        },

        cantidad: {
            type: Number
        },

        subtotal: {
            type: Number
        }
    }],

    status: {
        type: Schema.Types.ObjectId,
        ref: 'Status',
    },

    addressShip: {
        type: String
    },

    paymentMethod: {
        type: String,
        required: true,
        default: 'EFECTIVO',
        emun: ['EFECTIVO','TARJETA','TRANSFERENCIA']
    },

    createdDate: {
        type: Date
    },

});



OrderSchema.methods.toJSON = function(){
    const{ __v, ...order } = this.toObject();
    order.createdBy = order.user;
    return order;
}

module.exports = model( 'Order', OrderSchema );