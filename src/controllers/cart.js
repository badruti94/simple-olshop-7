const { cart: cartModel, item: itemModel } = require('../../models')

exports.addToCart = async (req, res, next) => {
    try {
        const { item_id } = req.body

        const item = await itemModel.findByPk(item_id)
        if (item.stock == 0) {
            const error = new Error()
            error.errorCode = 400
            error.message = 'Maaf, stok untuk item ini sedang kosong. Silakan coba pesan kembali nanti.'
            throw error
        }
        const [cart, created] = await cartModel.findOrCreate({
            where: {
                user_id: req.userId,
                item_id,
            },
            defaults: {
                qty: 1
            }
        })

        if (created) {
            await itemModel.increment({
                stock: -1
            }, {
                where: {
                    id: item_id
                }
            })
        }

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
        const { id } = req.params

        const cartItem = await cartModel.findByPk(id)
        const item = await itemModel.findByPk(cartItem.item_id)
        if (item.stock == 0) {
            const error = new Error()
            error.errorCode = 400
            error.message = 'Maaf, stok untuk item ini sedang kosong. Silakan coba pesan kembali nanti.'
            throw error
        }
        const result = await cartModel.increment({
            qty: 1
        }, {
            where: {
                id
            }
        })


        await itemModel.increment({
            stock: -1
        }, {
            where: {
                id: cartItem.item_id
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

            const cartItem = await cartModel.findByPk(id)
            await itemModel.increment({
                stock: 1
            }, {
                where: {
                    id: cartItem.item_id
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
        const cartData = await cartModel.findAll({
            where: {
                user_id: req.userId,
            },
        })

        const minusStock = async (itemId, stock) => {
            await itemModel.increment({
                stock: stock
            }, {
                where: {
                    id: itemId
                }
            })
        }

        const minusStocks = cartData.map(data => minusStock(data.dataValues.item_id, data.dataValues.qty))
        await Promise.all(minusStocks)

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