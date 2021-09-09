const { Router } = require('express');
const { check } = require('express-validator');
const { getStatus, getStatusS, createStatus, updateStatus, deleteStatus } = require('../controllers/status');
const { statusByIdExists } = require('../helpers/db-validators');
const { validarJWT, validarCampos, isAdminRole } = require('../middlewares');

const router = Router();

router.get('/', getStatus);

router.get('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(statusByIdExists),
    validarCampos
], getStatusS);

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], createStatus)

router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(statusByIdExists),
    validarCampos
], updateStatus);

router.delete('/:id', [
    validarJWT,
    isAdminRole,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(statusByIdExists),
    validarCampos
],deleteStatus);


module.exports = router;