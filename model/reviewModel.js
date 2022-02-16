const mongoose = require('mongoose')
const {Schema}= mongoose

const reviewSchema = new Schema({
    rating: Number,
    review:String
})

module.exports =new mongoose.model('Review', reviewSchema)