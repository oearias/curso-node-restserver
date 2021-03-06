const { Router } = require('express');
const { check } = require('express-validator');
const { getProduct, getProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/products');
const { productByIdExists, categoryByIdExists, brandByIdExists } = require('../helpers/db-validators');
const { validarJWT, validarCampos, isAdminRole } = require('../middlewares');

const router = Router();

// {{url}}/api/cproducts

router.get('/', getProducts);

router.get('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(productByIdExists),
    validarCampos
], getProduct);

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('category', 'La categoría es obligatoria').not().isEmpty(),
    check('category', 'No es un id válido el de la categoría').isMongoId(),
    check('category').custom(categoryByIdExists),
    check('marca', 'La marca es obligatoria').not().isEmpty(),
    check('marca', 'No es un id válido el de la marca').isMongoId(),
    check('marca').custom(brandByIdExists),
    validarCampos
], createProduct)

router.put('/:id', [
    validarJWT,
    //check('nombre', 'El nombre es obligatorio').not().isEmpty(), //El nombre no necesariamente se tiene que actualizar, puede ser el precio o oalgun otro dato 
    check('id', 'No es un id válido').isMongoId(),
    check('category', 'No es un id válido el de la categoría').isMongoId(), 
    check('id').custom(productByIdExists),
    validarCampos
], updateProduct);

router.delete('/:id', [
    validarJWT,
    isAdminRole,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(productByIdExists),
    validarCampos
],deleteProduct);


module.exports = router;