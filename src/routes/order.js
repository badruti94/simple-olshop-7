const express = require('express')
const router = express.Router()

const orderController = require('../controllers/order')
const {mustRole} = require('../middlewares/auth')

router.post('/', mustRole('user'), orderController.makeOrder)
router.get('/', mustRole('all'), orderController.getOrders)
router.get('/:id', mustRole('all'), orderController.getOrderById)
router.put('/:id/pay', mustRole('user'), orderController.payOrder)
router.patch('/:id/send', mustRole('admin'), orderController.sendOrder)
router.patch('/:id/receive', mustRole('user'), orderController.receiveOrder)

module.exports = router