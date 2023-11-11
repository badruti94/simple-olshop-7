const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { user: userModel } = require('../../models')
const { registerSchema, loginScheme } = require('../validations/auth')

exports.register = async (req, res, next) => {
    try {
        const { error } = registerSchema.validate(req.body)
        if (error) throw error

        const salt = await bcrypt.genSalt(10)
        const password = await bcrypt.hash(req.body.password, salt)
        const result = await userModel.create({ ...req.body, password })
        const { user_id, username, role } = result

        res.status(201).send({
            message: 'Register success. Silahkan login',
            data: {
                user_id,
                username,
                role,
            }
        })

    } catch (error) {
        next(error)
    }
}

exports.login = async (req, res, next) => {
    try {
        const { error } = loginScheme.validate(req.body)
        if (error) throw error
        // const { username, password } = req.body.username
        const userFound = await userModel.findOne({
            where: {
                username: req.body.username
            }
        })
        if (!userFound) {
            const error = new Error('User not found')
            error.errorCode = 404
            throw error
        }
        const result = await bcrypt.compare(req.body.password, userFound.password)
        if (!result) {
            const error = new Error('Wrong password')
            error.errorCode = 401
            throw error
        }

        const { id: userId, role } = userFound

        const secretKey = process.env.SECRET_KEY || 'secret'
        const token = jwt.sign({ userId, role }, secretKey)

        res.status(200).send({
            message: 'Login success',
            data: {
                user_id: userId,
                username: req.body.username,
                role,
            },
            token
        })

    } catch (error) {
        next(error)
    }
}