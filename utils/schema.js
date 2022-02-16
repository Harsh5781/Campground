const joi = require('joi')
module.exports.campgroundValidate= joi.object({
    name:joi.string().required(),
    price:joi.number().required().min(0),
    location: joi.string().required(),
    image: joi.string().required(),
    description: joi.string().required()
})

module.exports.reviewValidate = joi.object({
    rating: joi.number().required().min(1).max(5),
    review:joi.string().required()
})

module.exports.userValidate = joi.object({
    username:joi.string().required(),
    email: joi.string().required(),
    password:joi.string().required()
})