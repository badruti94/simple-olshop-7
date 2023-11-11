const { cart: cartModel, item: itemModel } = require('../../models')

exports.addToCart = async (req, res, next) => {
    try {
        const result = await cartModel.findOrCreate({
            where: {
                user_id: req.userId,
                item_id: req.body.item_id
            },
            defaults: {
                qty: 1
            }
        })

        res.status(201).send({
            message: 'Add to cart success'
        })
    } catch (error) {
        next(error)
    }
}

exports.getCartData = async (req, res, next) => {
    try {
        const cartData = await cartModel.findAll({
            where: {
                user_id: req.userId,
            },
            include: {
                model: itemModel,
                as: 'item',
                attributes: ['name', 'price']
            }
        })

        res.status(200).send({
            data: cartData
        })
    } catch (error) {
        next(error)
    }
}

exports.plusItemInCart = async (req, res, next) => {
    try {
        const result = await cartModel.increment({
            qty: 1
        }, {
            where: {
                id: req.params.id
            }
        })

        res.status(200).send({
            message: 'Plus to cart success'
        })
    } catch (error) {
        next(error)
    }
}

exports.minusItemInCart = async (req, res, next) => {
    try {
        const { id } = req.params

        const cart = await cartModel.findByPk(id)
        if (cart.qty > 1) {
            const result = await cartModel.increment({
                qty: -1
            }, {
                where: {
                    id
                }
            })
        }

        res.status(200).send({
            message: 'Minus to cart success'
        })
    } catch (error) {
        next(error)
    }
}

exports.clearItemInCart = async (req, res, next) => {
    try {
        const cart = await cartModel.destroy({
            where: {
                user_id: req.userId,
            }
        })

        res.status(200).send({
            message: 'Clear item in cart success'
        })
    } catch (error) {
        next(error)
    }
}