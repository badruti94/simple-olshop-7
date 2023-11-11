const { user: userModel } = require('../../models')
const { updateProfileScheme } = require('../validations/profile')

exports.getProfile = async (req, res, next) => {
    try {
        const profile = await userModel.findByPk(req.userId, {
            excludes: ['role', 'password']
        })
        res.status(200).send({
            data: profile
        })
    } catch (error) {
        next(error)
    }
}

exports.updateProfile = async (req, res, next) => {
    try {
        const { error } = updateProfileScheme.validate(req.body)
        if (error) throw error

        const profile = await userModel.update(req.body, {
            where: {
                id: req.userId
            }
        })

        res.status(200).send({
            message: 'Update profile success'
        })
    } catch (error) {
        next(error)
    }
}