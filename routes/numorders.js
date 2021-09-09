const { Router } = require('express');
const { check } = require('express-validator');
const { createNumOrder } = require('../controllers/numorders');
const { brandByIdExists } = require('../helpers/db-validators');
const { validarJWT, validarCampos, isAdminRole } = require('../middlewares');

const router = Router();

router.post('/', [
    //validarJWT,
    check('numero', 'El numero es obligatorio').not().isEmpty(),
    validarCampos
], createNumOrder)



module.exports = router;