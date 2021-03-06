const { Router } = require('express');
const { check } = require('express-validator');

const { isValidRole, clientByIdExists, emailExistsC } = require('../helpers/db-validators');

// Middlewares
const { validarCampos, validarJWT, isAdminRole, hasRole } = require('../middlewares');

const { clientsGet, clientGet, clientsPost, clientsPut, clientsDelete } = require('../controllers/clients');


const router = Router();

router.get('/', clientsGet);

router.get('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(clientByIdExists),
    validarCampos
], clientGet);

router.post('/', [ 
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    //check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    check('email', 'El correo ingresado no tiene un formato válido').isEmail(),  //valida el email
    check('email').custom( emailExistsC ),   //verifica que no exista el email
    //check('role', 'El rol no es válido').isIn(['ADMIN_ROLE','USER_ROLE']),   //se comparan los roles con un arreglo
    // check('role').custom( (role) => isValidRole(role)),  //esto se simplifica y queda mejor como la línea de abajo
    check('role').custom( isValidRole ),
    validarCampos
] , clientsPost);

router.put('/:id', [
    check('id','No es un id válido').isMongoId(),
    check('id').custom( clientByIdExists ),
    //check('role').custom( isValidRole ),
    validarCampos
] , clientsPut);

router.delete('/:id', [
    validarJWT,
    hasRole('ADMIN_ROLE','OCTOPUS_ROLE'),  //Puede ser ADMIN_ROLE o algún otro role
    //isAdminRole,  //Necesariamente tiene que ser ADMIN_ROLE
    check('id','No es un id válido').isMongoId(),
    check('id').custom( clientByIdExists ),
    validarCampos
] , clientsDelete);


module.exports = router;