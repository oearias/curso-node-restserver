const { Router } = require('express');
const { check } = require('express-validator');
const { getPedidoActivities, getPedidoActivity, createPedidoActivity, updatePedidoActivity, deletePedidoActivity } = require('../controllers/pedidoactivity');
const { activityByIdExists, orderByIdExists } = require('../helpers/db-validators');
const { validarJWT, validarCampos, isAdminRole } = require('../middlewares');

const router = Router();

router.get('/', getPedidoActivities);

router.get('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(activityByIdExists),
    validarCampos
], getPedidoActivity);

router.post('/', [
    validarJWT,
    check('actividad', 'El descripcion de la actividad es obligatorio - actividad').not().isEmpty(),
    check('order', 'No es un id válido').isMongoId(),
    check('order').custom(orderByIdExists),
    validarCampos
], createPedidoActivity)

router.put('/:id', [
    validarJWT,
    check('actividad', 'El descripcion de la actividad es obligatorio - actividad').not().isEmpty(),
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(activityByIdExists),
    validarCampos
], updatePedidoActivity);

router.delete('/:id', [
    validarJWT,
    isAdminRole,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(activityByIdExists),
    validarCampos
],deletePedidoActivity);


module.exports = router;