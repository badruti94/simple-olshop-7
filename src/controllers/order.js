const { order: orderModel, user: userModel, cart: cartModel, order_item: orderItemModel, item: itemModel } = require('../../models')
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

        const cartItems = await cartModel.findAll({
            where: {
                user_id: req.userId
            }
        })

        const dataOrderItem = []
        cartItems.map(item => {
            dataOrderItem.push({
                order_id: order.id,
                qty: item.dataValues.qty,
                item_id: item.dataValues.item_id,
            })
        })

        const orderItem = await orderItemModel.bulkCreate(dataOrderItem)
        await cartModel.destroy({
            where: {
                user_id: req.userId
            }
        })

        res.status(200).send({
            message: 'Make order success',
            data: {
                order_id: order.id
            }
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
                attributes: ['id', 'createdAt', 'total', 'status'],
            })
        }

        res.status(200).send({
            data: orders
        })

    } catch (error) {
        next(error)
    }
}

exports.getOrderById = async (req, res, next) => {
    try {
        const order = await orderModel.findByPk(req.params.id, {
            include: [
                {
                    model: userModel,
                    as: 'user',
                    attributes: ['username']
                },
                {
                    include: {
                        model: itemModel,
                        as: 'item',
                        attributes: ['name', 'price']
                    },
                    model: orderItemModel,
                    as: 'order_item',
                    attributes: ['id','qty']
                },
            ],
            // include: {
            //     model: userModel,
            //     as: 'user',
            //     attributes: ['username']
            // },
            // include: {
            //     include: {
            //         model: itemModel,
            //         as: 'item',
            //         attributes: ['name', 'price']
            //     },
            //     model: orderItemModel,
            //     as: 'order_item',
            //     attributes: ['qty']
            // },
            attributes: ['id', 'createdAt', 'total', 'status', 'payment_proof']
        })
        res.status(200).send({
            data: order
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