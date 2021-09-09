const { Router } = require('express');
const { check } = require('express-validator');
const { createOrder, updateOrder, deleteOrder, getOrder, getOrders, guardar } = require('../controllers/orders');
const { orderByIdExists, userByIdExists, statusByIdExists } = require('../helpers/db-validators');
const { validarJWT, validarCampos, isAdminRole } = require('../middlewares');

const router = Router();

// Obtener todas las categorías - público
router.get('/', getOrders);

router.get('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(orderByIdExists),
    validarCampos
], getOrder);

/*router.post('/', [
    validarJWT,
    check('cliente', 'El campo cliente es obligatorio').not().isEmpty(), ////???????
    check('user', 'El campo cliente es obligatorio').not().isEmpty(),
    check('user').custom(userByIdExists),
    validarCampos
], createOrder)*/

router.put('/:id', [
    validarJWT,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(orderByIdExists),
    check('status', 'No es un id válido').isMongoId(),
    check('status').custom(statusByIdExists),
    validarCampos
], updateOrder);

/*router.delete('/:id', [
    validarJWT,
    isAdminRole,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(orderByIdExists),
    validarCampos
],deleteOrder);*/

router.post('/', [
    validarJWT,
    check('cliente', 'El campo cliente es obligatorio').not().isEmpty(), ////???????
    check('user', 'El campo usuario es obligatorio').not().isEmpty(),
    check('user').custom(userByIdExists),
    validarCampos
], createOrder)


module.exports = router;