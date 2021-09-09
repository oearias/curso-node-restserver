const { Router } = require('express');
const { check } = require('express-validator');
const { getMarcas, createMarca, getMarca, updateMarca, deleteMarca } = require('../controllers/marcas');
const { brandByIdExists } = require('../helpers/db-validators');
const { validarJWT, validarCampos, isAdminRole } = require('../middlewares');

const router = Router();

router.get('/', getMarcas);

router.get('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(brandByIdExists),
    validarCampos
], getMarca);

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], createMarca)

router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(brandByIdExists),
    validarCampos
], updateMarca);

router.delete('/:id', [
    validarJWT,
    isAdminRole,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(brandByIdExists),
    validarCampos
],deleteMarca);


module.exports = router;