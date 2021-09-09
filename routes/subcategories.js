const { Router } = require('express');
const { check } = require('express-validator');
const { createSubcategory, getSubcategory, updateSubcategory, deleteSubcategory, getSubcategories } = require('../controllers/subcategories');
const { subcategoryByIdExists } = require('../helpers/db-validators');
const { validarJWT, validarCampos, isAdminRole } = require('../middlewares');

const router = Router();

// Obtener todas las categorías - público
router.get('/', getSubcategories);

// Obtener una categoría por id - público
router.get('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(subcategoryByIdExists),
    validarCampos
], getSubcategory);

// Crear categoría - privado - cualquier persona con token valido
router.post('/', [
    validarJWT,
    check('category', 'La categoría es obligatoria').not().isEmpty(),
    check('category', 'No es un id válido el de la categoría').isMongoId(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], createSubcategory)

// Actualizar categoría - privado - cualquier persona con token valido
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(subcategoryByIdExists),
    validarCampos
], updateSubcategory);

// Borrar categoría - privado - ROLE_ADMIN
router.delete('/:id', [
    validarJWT,
    isAdminRole,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(subcategoryByIdExists),
    validarCampos
],deleteSubcategory);


module.exports = router;