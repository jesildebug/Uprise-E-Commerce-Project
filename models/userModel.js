const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    FullName: {
        type: String,
        required: true
    },
    UserName : {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true,
        unique: true
    },

    Phone: {
        type: Number,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Unblocked'
    }

})

module.exports = UserModel = mongoose.model('UserData', userSchema);
