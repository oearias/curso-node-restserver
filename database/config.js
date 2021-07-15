const mongoose = require('mongoose');

const dbConnection = async() => {

    try {
        
        await mongoose.connect( process.env.MONGODB_ATLAS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log('Database connected');

    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar la DB');
    }

}

module.exports = {
    dbConnection
}