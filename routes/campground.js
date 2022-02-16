const express= require('express')
const route = express.Router({mergeParams: true})

// const mongoose = require('mongoose')
const campground = require('../model/mongo')

const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/expressError')
const {campgroundValidate} = require('../utils/schema')

const checkLogin = require('../isLoggedin')

const cValidate = function(req, res ,next){
    const {error }= campgroundValidate.validate(req.body)
    if(error)
    {
        const message = error.details.map(el=>el.message).join(',')
        throw new ExpressError(message, 400)
    }
    else{
        next()
    }
}

route.get('/',async (req, res)=>{
    const camp= await campground.find()
    res.render('home',{camp} )
})
route.get('/add', checkLogin, (req, res)=>{
    res.render('new')
})
route.post('/', cValidate, checkLogin, catchAsync(async (req,res, next)=>{
    const camp = new campground(req.body)
    camp.author = req.user
    await camp.save()
    req.flash('success', 'Successfully created a new campground')
    res.redirect(`/campground/${camp.id}`)
}))
route.get('/:id',catchAsync( async (req, res)=>{
    const camp = await campground.findById(req.params.id).populate('reviews').populate('author')
    if(!camp){
        req.flash('error', 'Sorry no campground found')
       return res.redirect('/campground')
   }
    res.render('show', {camp})
}))
route.get('/:id/edit', checkLogin, catchAsync(async (req, res)=>{
    const {id}= req.params
    const camp = await campground.findById(req.params.id)
    if(!camp){
         req.flash('error', 'Sorry no campground found')
        return res.redirect('/campground')
    }
    if(!camp.author.equals(req.user)){
        req.flash('error', 'You are not authorized')
        return res.redirect(`/campground/${id}`)
    }
    res.render('edit', {camp})
}))
route.put('/:id',cValidate, checkLogin, catchAsync(async(req, res)=>{
    const id = req.params.id
    const camp = await campground.findById(id)
    if(!camp.author.equals(req.user)){
        req.flash('error', 'You are not authorized')
        return res.redirect(`/campground/${id}`)
    }
    // const camp = req.body
    const a = await campground.findByIdAndUpdate(id, req.body)
    res.redirect(`/campground/${a.id}`)
}))
route.delete('/:id', checkLogin, catchAsync( async(req, res)=>{
    const id = req.params.id
    const a = await campground.findByIdAndDelete(id)
    res.redirect(`/campground`)
}))

module.exports=route