const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../database/config');

class Server {

    constructor() {

        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: '/api/auth',
            brands: '/api/brands',
            buscar: '/api/buscar',
            clientes: '/api/clients',
            categories: '/api/categories',
            numorder: '/api/numorders',
            orders: '/api/orders',
            ordersD: '/api/ordersDetail',
            pedidoActivity: '/api/pedidoActivity',
            products: '/api/products',
            status: '/api/status',
            subcategories: '/api/subcategories',
            uploads: '/api/uploads',
            users: '/api/users'
        }

        // Conectar a la base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de la aplicación
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {

        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

        // Directorio público
        this.app.use(express.static('public'));

        // Carga de archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }

    routes() {

        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.brands, require('../routes/marcas'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.categories, require('../routes/categories'));
        this.app.use(this.paths.clientes, require('../routes/clients'));
        this.app.use(this.paths.numorder, require('../routes/numorders'));
        this.app.use(this.paths.orders, require('../routes/orders'));
        this.app.use(this.paths.pedidoActivity, require('../routes/pedidoActivity'));
        this.app.use(this.paths.products, require('../routes/products'));
        this.app.use(this.paths.subcategories, require('../routes/subcategories'));
        this.app.use(this.paths.status, require('../routes/status'));
        this.app.use(this.paths.uploads, require('../routes/uploads')); // Path: /api/users
        this.app.use(this.paths.users, require('../routes/users')); // Path: /api/users

    }

    listen() {
        this.app.listen(this.port, () => {
            console.log("Server running on port:", this.port);
        });
    }
}

module.exports = Server;