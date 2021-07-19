
const { Schema, model } = require('mongoose');

const UserSchema = Schema({
    
    nombre: {
        type: String,
        required: [true, 'El nombre es obigatorio']
    },

    email: {
        type: String,
        required: [true, 'El email es obigatorio'],
        unique: true
    },

    password: {
        type: String,
        required: [true, 'La contraseña es obigatoria']
    },

    img: {
        type: String
    },

    role: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        emun: ['ADMIN_ROLE','USER_ROLE']
    },

    status: {
        type: Boolean,
        default: true
    },

    google: {
        type: Boolean,
        default: false
    }
});

UserSchema.methods.toJSON = function(){
    const{ __v, password, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;
}

module.exports = model( 'User', UserSchema );