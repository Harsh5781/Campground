const express = require('express')
const passport = require('passport')
const route = express.Router({mergeParams:true})

const User = require('../model/user')

const {userValidate} = require('../utils/schema')

const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/expressError')

const uValidate = function(req, res ,next){
    const {error }= userValidate.validate(req.body)
    if(error)
    {
        const message = error.details.map(el=>el.message).join(',')
        throw new ExpressError(message, 400)
    }
    else{
        next()
    }
}

route.get('/register', (req, res)=>{
    
    res.render('register')
})
route.post('/register', catchAsync( async(req, res, next)=>{
    try{
        const {username, email, password} = req.body
        const user = new User({ email, username})
        const newUser = await User.register(user, password)
        req.login(newUser, (e)=>{
            if(e){
                next(e)
            }
            else{
                req.flash('success', 'Registered successfully')
                const url = req.session.url || '/campground'
                res.redirect(url)
                
            }
        })
    }
    catch(e){
        req.flash('error', e.message)
        res.redirect('/register')
    }
}))

route.get('/login', (req, res)=>{
    res.render('login')
})
route.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),catchAsync(async (req, res)=>{
    req.flash('success', 'Welcome back')
    const url = req.session.url || '/campground'
    res.redirect(url)
}))
route.get('/logout', (req, res)=>{
    req.logOut()
    req.flash('success', 'Logged out successfully')
    res.redirect('/campground')
})
 
module.exports = route