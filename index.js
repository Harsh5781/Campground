const express = require('express')
const app = express()

const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')

const campgroundRoute = require('./routes/campground')
const reviewRoute = require('./routes/review')
const userRoute =require('./routes/user')

const mongoose = require('mongoose')
const campground = require('./model/mongo')
const Review = require('./model/reviewModel')
const User = require('./model/user')

const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/expressError')
const {reviewValidate, campgroundValidate} = require('./utils/schema')

const session = require('express-session')
const flash = require('connect-flash')

const passport = require('passport')
const localStrategy = require('passport-local')

mongoose.connect('mongodb://localhost:27017/yelpCamp')
.then(console.log('Connected to the yelpCamp database'))
.catch(err=>console.log('Error'))

const sessionDetail = {
    secret: 'secretCode',
    saveUninitialized: true,
    resave:false,
    cookie:{
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}
app.use(session(sessionDetail))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))

app.use((req, res, next)=>{
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use('/campground', campgroundRoute)
app.use('/campground/:id/review', reviewRoute)
app.use('/', userRoute)


app.get('/', (req, res)=>{
    res.send('Welcome Home')
})



app.all('*',(req, res, next)=>{
    next(new ExpressError('Page Not Found!!!', 404))
})

app.use((err, req, res, next)=>{
    const { status=500}= err
    if(!err.message) err.message='Something Went Wrong!!!'
    res.status(status).render('error', {err})
})

app.listen(3000, ()=>{
    console.log('Listening to port 3000')
})