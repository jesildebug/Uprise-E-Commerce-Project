const mongoose = require('mongoose');
const objectId = mongoose.Types.objectId
const bannerSchema = new mongoose.Schema({

    bannerName:{
    type: String,
    required:true,
    },
    description: {
     type: String,
     required: true
    },

    image: {
        type: [String],
        required :true,

    },

    status: {
        type: String,
        default:  'List'
    },
    update : {
        type : Boolean,
        default : true
    }
    
})

module.exports = BannerModel = mongoose.model('BannerData',bannerSchema);