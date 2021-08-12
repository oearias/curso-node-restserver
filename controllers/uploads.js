const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);


const { response } = require("express");
const { subirArchivo } = require("../helpers");
const { User, Product } = require("../models");


const uploadFile = async (req, res = response) => {

    try {
        //const fileName = await subirArchivo(req.files, ['txt', 'pdf'], 'textFiles');
        const fileName = await subirArchivo(req.files, undefined, 'imgs');

        res.json({ fileName });

    } catch (msg) {
        res.status(400).json({ msg });
    }



}

const updateImage = async (req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {

        case 'users':
            modelo = await User.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe usuario con el id: ${id}`
                })
            }
            break;


        case 'products':
            modelo = await Product.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe producto con el id: ${id}`
                })
            }
            break;

        default: return res.status(500).json({
            msg: 'Se me olvidó validar esto'
        })

    }

    try {

        // Limpiar imagenes previas antes de subir una nueva
        if (modelo.img) {
            // Hay que borrar la imagen del servidor
            const pathImage = path.join(__dirname, '../uploads', coleccion, modelo.img)

            if (fs.existsSync(pathImage)) {
                fs.unlinkSync(pathImage);
            }
        }

        const fileName = await subirArchivo(req.files, undefined, coleccion);
        modelo.img = fileName;

        await modelo.save();

        res.json({ modelo });

    } catch (msg) {
        res.status(400).json({ msg });
    }


}

const updateImageCloudinary = async (req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {

        case 'users':
            modelo = await User.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe usuario con el id: ${id}`
                })
            }
            break;


        case 'products':
            modelo = await Product.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe producto con el id: ${id}`
                })
            }
            break;

        default: return res.status(500).json({
            msg: 'Se me olvidó validar esto'
        })

    }

    try {

        // Limpiar imagenes previas antes de subir una nueva a Cloudinary
        if (modelo.img) {
            const nombreArr = modelo.img.split('/');
            const nombre = nombreArr[nombreArr.length - 1];
            const [public_id] = nombre.split('.');

            cloudinary.uploader.destroy(public_id);
        }

        const { tempFilePath } = req.files.archivo;

        const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

        modelo.img = secure_url;

        await modelo.save();

        res.json({ modelo });

    } catch (msg) {
        res.status(400).json({ msg });
    }


}

const showImage = async (req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {

        case 'users':
            modelo = await User.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe usuario con el id: ${id}`
                })
            }
            break;


        case 'products':
            modelo = await Product.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe producto con el id: ${id}`
                })
            }
            break;

        default: return res.status(500).json({
            msg: 'Se me olvidó validar esto'
        })

    }

    try {

        // Limpiar imagenes previas antes de subir una nueva
        if (modelo.img) {
            // Hay que borrar la imagen del servidor
            const pathImage = path.join(__dirname, '../uploads', coleccion, modelo.img);

            if (fs.existsSync(pathImage)) {
                return res.sendFile(pathImage)
            }
        }

        const pathImage = path.join(__dirname, '../assets/no-image.jpeg');

        res.sendFile(pathImage);

    } catch (msg) {
        res.status(400).json({ msg });
    }
}

const showImageCloudinary = async (req, res = response) => {
    
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {

        case 'users':
            modelo = await User.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe usuario con el id: ${id}`
                })
            }
            break;


        case 'products':
            modelo = await Product.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe producto con el id: ${id}`
                })
            }
            break;

        default: return res.status(500).json({
            msg: 'Se me olvidó validar esto'
        })

    }

    try {

        if (modelo.img) {

            const {img} = modelo;

            return res.json({img});

            //return res.redirect(modelo.img)
        }

        const pathImage = path.join(__dirname, '../assets/no-image.jpeg');

        res.sendFile(pathImage);

    } catch (error) {
        res.status(400).json({ msg: error });
    }
}

module.exports = {
    uploadFile,
    updateImage,
    updateImageCloudinary,
    showImage,
    showImageCloudinary
}