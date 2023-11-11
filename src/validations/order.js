const Joi = require("joi");

const makeOrderScheme = Joi.object({
    total: Joi.number().required().min(100),
})

module.exports = { makeOrderScheme }