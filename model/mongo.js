const mongoose = require('mongoose')
const Review = require('./reviewModel')
const Schema = mongoose.Schema
const campgroundSchema = new Schema({
    name: String,
    image: String,
    price: Number, 
    description: String,
    location: String,
    reviews: [{
        type:Schema.Types.ObjectId,
        ref: 'Review'
    }],
    author:{
        type:Schema.Types.ObjectId,
        ref: 'User'
    }
})

campgroundSchema.post('findOneAndDelete', async function(doc){
    if(doc)
    {
        await Review.deleteMany({
            _id: {$in: doc.reviews}
        })
    }
})

const Campground= new mongoose.model('Campground', campgroundSchema)
module.exports = Campground