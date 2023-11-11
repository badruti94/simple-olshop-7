const Joi = require("joi");

const registerSchema = Joi.object({
    username: Joi.string().required().min(5),
    email: Joi.string().required().email(),
    name: Joi.string().required(),
    phone_number: Joi.string().min(10).pattern(/^[0-9]+$/).message('phone number is not valid'),
    address: Joi.string().required().min(5),
    password: Joi.string().required().min(8),
})

const loginScheme = Joi.object({
    username: Joi.string().required().min(5),
    password: Joi.string().required().min(8),
})

module.exports = { registerSchema, loginScheme }