const mongoose = require('mongoose')
const mongoose_delete = require('mongoose-delete')


const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false,
        default: null
    },
    synopsis: {
        type: String,
        required: false,
        default: null
    },
    poster: {
        type: String,
        required: false,
        default: null,
        get : getImage
    },
    trailer:{
        type: String,
        required: false,
        default: null,
    },
    genre:{
        type: String,
        required: false,
        default: null
    },
    director:{
        type: String,
        required: false,
        default: null
    },
    characters:{
        type: String,
        required: false,
        default: null
    },
    release_date:{
        type:String,
        required:false,
        default:null
    },

}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    versionKey: false ,
    toJSON:{ getters:true }
})
function getImage(poster){
    return 'http://ec2-13-229-61-46.ap-southeast-1.compute.amazonaws.com:6969/img/' + poster
}

movieSchema.plugin(mongoose_delete, {overrideMethods: 'all' }) 

module.exports = movie = mongoose.model('movie', movieSchema, 'movie') 