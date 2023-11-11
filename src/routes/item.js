const express = require('express')
const router = express.Router()
const itemController = require('../controllers/item')

const {mustRole} = require('../middlewares/auth')

router.post('/', mustRole('admin'), itemController.createItem)
router.get('/', itemController.getAllItem)
router.get('/:id', itemController.getItemById)
router.put('/:id', itemController.updateItem)
router.delete('/:id', itemController.deleteItem)

module.exports = router