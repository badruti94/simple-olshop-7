const Joi = require("joi");

const itemScheme = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required().min(100),
    stock: Joi.number().required().min(5),
    description: Joi.string().required().min(10),
    image: Joi.any(),
})

module.exports = { itemScheme }