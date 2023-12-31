const { Op } = require('sequelize')
const { item: itemModel, user: userModel } = require('../../models')
const { uploadToCloudinary } = require('../utils/upload')
const { imageValidation } = require('../validations/image')
const { itemScheme } = require('../validations/item')

exports.createItem = async (req, res, next) => {
    try {
        const { error } = itemScheme.validate(req.body)
        if (error) throw error
        imageValidation(req.files, 'image')
        console.log('tessss');

        const secure_url = await uploadToCloudinary(req.files.image)
        const result = await itemModel.create({
            ...req.body,
            image: secure_url
        })

        res.status(201).send({
            message: 'Create item success',
            result: result.secure_url
        })
    } catch (error) {
        next(error)
    }
}

exports.getAllItem = async (req, res, next) => {
    try {
        const { page = 1, perPage = 4, search = '' } = req.query

        let result = await itemModel.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'description'],
            },
            where: {
                name: {
                    [Op.iLike]: `%${search}%`
                }
            },
            offset: (parseInt(page) - 1) * parseInt(perPage),
            limit: parseInt(perPage),
            order: [['id', 'ASC']]
        })
        const totalData = await itemModel.count({
            where: {
                name: {
                    [Op.iLike]: `%${search}%`
                }
            },
        })

        res.status(200).send({
            data: result,
            total_data: totalData,
        })

    } catch (error) {
        next(error)
    }
}

exports.getItemById = async (req, res, next) => {
    try {
        const item = await itemModel.findByPk(req.params.id)
        const admin = await userModel.findOne({
            where: {
                role: 'admin'
            }
        })
        res.status(200).send({
            data: {
                item,
                no_admin: admin.phone_number
            }
        })
    } catch (error) {
        next(error)
    }
}

exports.getItemStockById = async (req, res, next) => {
    try {
        const item = await itemModel.findByPk(req.params.id)
        res.status(200).send({
            data: item.stock
        })
    } catch (error) {
        next(error)
    }
}

exports.updateItem = async (req, res, next) => {
    try {
        const { error } = itemScheme.validate(req.body)
        if (error) throw error

        if (req.files) {
            req.body.image = await uploadToCloudinary(req.files.image)
        }

        const result = await itemModel.update(req.body, {
            where: {
                id: req.params.id
            }
        })

        res.status(200).send({
            message: 'Update item success'
        })
    } catch (error) {
        next(error)
    }
}

exports.deleteItem = async (req, res, next) => {
    try {
        const result = await itemModel.destroy({
            where: {
                id: req.params.id
            }
        })

        res.status(200).send({
            message: 'Delete item success'
        })
    } catch (error) {
        next(error)
    }
} 