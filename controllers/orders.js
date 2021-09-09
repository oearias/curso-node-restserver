const { response } = require('express');
const { generaNumOrden } = require('../helpers');
const { Order, Product, Numorder } = require('../models');

const getOrders = async (req, res = response) => {

    const { limite = 100, desde = 0 } = req.query;

    const query = {}  //TODO: pendiente definir el Query

    const [total, orders] = await Promise.all([
        Order.countDocuments(query),
        Order.find()
            .sort({'numOrden':-1}) //Descendente
            .populate('user', 'username')
            .populate('cliente','fullname')
            //.populate({ path: 'cliente', select: 'fullname' })
            .populate({ path: 'status', select: 'nombre' })
            //.skip(Number(desde))
            //.limit(Number(limite))
    ])

    res.json({
        total,
        orders
    });
}

const getOrder = async (req, res = response) => {

    const { id } = req.params;

    const order = await
        Order.findById(id)
        .populate('user', 'username')
        .populate('cliente', 'fullname')
        //.populate({ path: 'cliente', select: 'fullname' })
        .populate({ path: 'status', select: 'nombre' })

    res.json(order);
}

const createOrderrr = async (req, res = response) => {

    const { total, user, cliente, addressShip, paymentMethod } = req.body;

    const createdDate = new Date();

    const data = {
        user,
        total,
        cliente,
        addressShip,
        paymentMethod,
        createdDate
    }

    // Generar la data a guardar

    const order = new Order(data);
    await order.save();

    res.status(201).json(order);

}

const updateOrder = async (req, res = response) => {

    const { id } = req.params;

    const { ...data } = req.body;

    data.user = req.user._id;

    const order = await
        Order.findByIdAndUpdate(id, data, { new: true })   //new true: sirve para devolver siempre el documento actualizado
            .populate('user', 'fullname')
            .populate({ path: 'cliente', select: 'fullname' })
            .populate({ path: 'status', select: 'nombre' })

    res.json(order);
}

const deleteOrder = async (req, res = response) => {

    const { id } = req.params;

    const order = await Order.findByIdAndUpdate(id, { status: false });

    res.json({
        msg: "Orden Borrada",
        order
    });

}

const createOrder = async (req, res = response) => {

    const numOrden = await generaNumOrden();

    const { total, user, cliente, addressShip, paymentMethod, status} = req.body;

    let productosDetalle = req.body.productos_detalle;

    const createdDate = new Date();

    validar_cantidad(productosDetalle, (respuesta) => {

        if (respuesta == false)
            return res.json({
                msg: 'No hay productos para guardar'
            });

        let venta = new Order({
            numOrden,
            total,
            user,
            cliente,
            createdDate,
            addressShip,
            paymentMethod,
            status,
            orderDetail: respuesta
        });

        venta.save(async(err, newOrder) => {
            if (err){

                console.log(err);

                return res.json({
                    err
                });
            }
                
            res.json({
                newOrder
            });
        })
    })

    //actualizamos la tabla de numeros de orden
    console.log(numOrden);

    const data2 = {
        numero: numOrden
    }

    const numNew = new Numorder(data2);
    numNew.save();

}

const validar_cantidad = async (productos, callback) => {

    let productos_id = [];

    productos.forEach(element => {
        productos_id.push(element.producto_id);
    });

    let respuesta = [];

    Product.find({})
        .where("_id").in(productos_id)
        .exec(async (err, data) => {

            for (let i = 0; i < data.length; i++) {

                let cantidad = productos.find(p => p.producto_id == data[i]._id).cantidad;

                if (cantidad <= data[i].cantidad) {

                    cantidad_nueva = data[i].cantidad - cantidad;

                    let modifico = await Product.findByIdAndUpdate(data[i]._id, {
                        cantidad: cantidad_nueva
                    });

                    subtotal = cantidad * data[i].precio;

                    if (modifico != false) {
                        respuesta.push({
                            _id: data[i]._id,  //productos: data[i]._id, 
                            cantidad,
                            subtotal
                        })
                    }
                }

            }

            callback(respuesta.length == 0 ? false : respuesta);
        })
}

module.exports = {
    createOrder,
    getOrders,
    getOrder,
    updateOrder,
    deleteOrder
}