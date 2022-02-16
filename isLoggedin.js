module.exports = function (req, res ,next)
{
    if(!req.isAuthenticated())
    {
        req.session.url = req.originalUrl
        req.flash('error', 'You must logged in first')
        return res.redirect('/login')
    }
    else{
        next()
    }
}