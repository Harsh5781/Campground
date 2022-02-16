const express= require('express')
const route = express.Router({mergeParams: true})

const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/expressError')
const {reviewValidate} = require('../utils/schema')

const Review = require('../model/reviewModel')
const campground = require('../model/mongo')

const flash = require('connect-flash')

const rValidate = function(req, res ,next){
    const {error }= reviewValidate.validate(req.body)
    if(error)
    {
        const message = error.details.map(el=>el.message).join(',')
        throw new ExpressError(message, 400)
    }
    else{
        next()
    }
}

route.post('/',rValidate, catchAsync(async (req, res)=>{
    const {id} = req.params
    const camp = await campground.findById(id)
    const review = new Review(req.body)
    await camp.reviews.push(review)
    await camp.save()
    await review.save()
    req.flash('success', 'Successfully posted review')
    res.redirect(`/campground/${id}`)
}))

route.delete('/:reviewId', catchAsync(async (req, res)=>{
    const {id, reviewId} = req.params
    await campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/campground/${id}`)
}))

module.exports = route