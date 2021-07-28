const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignin } = require('../controllers/auth');
const { createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require('../controllers/categories');
const { categoryByIdExists } = require('../helpers/db-validators');
const { validarJWT, validarCampos, isAdminRole } = require('../middlewares');

const router = Router();

// {{url}}/api/categories


// Obtener todas las categorías - público
router.get('/', getCategories);

// Obtener una categoría por id - público
router.get('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(categoryByIdExists),
    validarCampos
], getCategory);

// Crear categoría - privado - cualquier persona con token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], createCategory)

// Actualizar categoría - privado - cualquier persona con token valido
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(categoryByIdExists),
    validarCampos
], updateCategory);

// Borrar categoría - privado - ROLE_ADMIN
router.delete('/:id', [
    validarJWT,
    isAdminRole,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(categoryByIdExists),
    validarCampos
],deleteCategory);


module.exports = router;