const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    // listing: Joi.object({
        title: Joi.string().required(),
        description : Joi.string().required(),
        image : Joi.string().allow(null).empty(''),   
        price : Joi.number().min(0).required(),
        location : Joi.string().required(),
        country : Joi.string().required(),
        category: Joi.string().required(),

    // }).required()
}).required();

module.exports.reviewSchema = Joi.object({
        comment: Joi.string().required().max(400),
        rating : Joi.number().required().min(1).max(5),
}).required();