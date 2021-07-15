const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

    constructor() {

        this.app = express();
        this.port = process.env.PORT;
        this.usersPath = '/api/users';

        // Conectar a la base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de la aplicación
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares() {

        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio público
        this.app.use(express.static('public'));
    }

    routes() {

        // Path: /api/users
        this.app.use( this.usersPath, require('../routes/users'));
        
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log("Server running on port:", this.port);
        });
    }
}

module.exports = Server;