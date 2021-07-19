const { response } = require('express');
const bcryptjs = require('bcryptjs')
const User = require('../models/user');
const { generarJWT } = require('../helpers/generate-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        // Verificar si el email existe
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - email'
            });
        }

        // Si el usuario está activo

        if (!user.status) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - status: false'
            });
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, user.password);

        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        // Generar el JWT
        const token = await generarJWT(user.id);


        res.json({
            user,
            token
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            msg: 'Algo salió mal, hable con el administrador'
        });
    }



}

const googleSignin = async (req, res = response) => {

    const { id_token } = req.body;

    try {

        const { nombre, email, img} = await googleVerify(id_token);

        let user = await User.findOne({ email });

        if( !user ){
            // Si el usuario no existe tengo que crearlo

            const data = {
                nombre,
                email,
                password: ':p',
                img,
                google: true
            };

            user = new User(data);
            await user.save();
        }

        // Si el usuario en BD está inactivo

        if( !user.status ){
            return res.status(401).json({
                msg: 'Hable con el Administrador - Usuario inactivo'
            })
        }

        // Generar el JWT
        const token = await generarJWT(user.id);

        res.json({
            user,
            token
        });

    } catch (error) {
        res.status(400).json({
            msg: 'Token de Google no es válido'
        })
    }


}

module.exports = {
    login,
    googleSignin
}