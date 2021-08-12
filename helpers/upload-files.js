const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => {

    return new Promise((resolve, reject) => {

        const { archivo } = files;
        const shortName = archivo.name.split('.'); 
        const extension = shortName[shortName.length - 1];

        // Validar la extension
        if ( !extensionesValidas.includes(extension)) {
            //ponemos return para asegurarnos que no va a seguir ejecutandose la aplicación
            return reject(`La extensión ${extension} no es permitida, por favor use solo extensiones: ${extensionesValidas}`);
        }

        const tempName = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, tempName);

        archivo.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }

            resolve(tempName);
        });
    });

}

module.exports = {
    subirArchivo
}