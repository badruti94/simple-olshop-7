const { order: orderModel, user: userModel } = require('../../models')
const { uploadToCloudinary } = require('../utils/upload')
const { imageValidation } = require('../validations/image')
const { makeOrderScheme } = require('../validations/order')

exports.makeOrder = async (req, res, next) => {
    try {
        const { error } = makeOrderScheme.validate(req.body)
        if (error) throw error

        const { total } = req.body

        const order = await orderModel.create({
            user_id: req.userId,
            total,
        })

        res.status(200).send({
            message: 'Make order success'
        })
    } catch (error) {
        next(error)
    }
}

exports.getOrders = async (req, res, next) => {
    try {
        let orders;
        console.log(req.role);
        if (req.role === 'user') {
            orders = await orderModel.findAll({
                attributes: ['id', 'createdAt', 'total', 'status'],
                where: {
                    user_id: req.userId
                }
            })
        } else {
            orders = await orderModel.findAll({
                include: {
                    model: userModel,
                    as: 'user',
                    attributes: ['username']
                },
                attributes: ['createdAt', 'total', 'status']
            })
        }

        res.status(200).send({
            data: orders
        })

    } catch (error) {
        next(error)
    }
}

exports.payOrder = async (req, res, next) => {
    try {
        imageValidation(req.files, 'payment_proof')
        const secure_url = await uploadToCloudinary(req.files.payment_proof)
        const order = orderModel.update({
            payment_proof: secure_url,
            status: 'Dibayar'
        }, {
            where: {
                id: req.params.id
            }
        })

        res.status(200).send({
            message: 'Pay order success',
        })
    } catch (error) {
        next(error)
    }
}

exports.sendOrder = async (req, res, next) => {
    try {
        const order = orderModel.update({
            status: 'Dikirim'
        }, {
            where: {
                id: req.params.id
            }
        })

        res.status(200).send({
            message: 'Send order success'
        })
    } catch (error) {
        next(error)
    }
}

exports.receiveOrder = async (req, res, next) => {
    try {
        console.log('params', req.params.id);
        const order = orderModel.update({
            status: 'Diterima'
        }, {
            where: {
                id: req.params.id
            }
        })

        res.status(200).send({
            message: 'Receive order success'
        })
    } catch (error) {
        next(error)
    }
} 