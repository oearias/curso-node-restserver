const { Router } = require('express');
const { check } = require('express-validator'); 
const { uploadFile, updateImage, showImage, updateImageCloudinary, showImageCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');

const { validarCampos, validarArchivoSubir } = require('../middlewares');

const router = Router();

router.post('/', validarArchivoSubir, uploadFile);

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'No es un id válido').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas ( c, ['users', 'products']) ),
    validarCampos
] , updateImageCloudinary);   //subir archivos a cloudinary
//] , updateImage);  //subir archivos al rest api

router.get('/:coleccion/:id',[
    check('id', 'No es un id válido').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas ( c, ['users', 'products']) ),
    validarCampos
], showImageCloudinary);
//], showImage);

module.exports = router;