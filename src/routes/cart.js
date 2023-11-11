const express = require('express')
const router = express.Router()

const cartController = require('../controllers/cart')
const {mustRole} = require('../middlewares/auth')


router.post('/', mustRole('user'), cartController.addToCart)
router.get('/', mustRole('user'), cartController.getCartData)
router.patch('/:id/plus', mustRole('user'), cartController.plusItemInCart)
router.patch('/:id/minus', mustRole('user'), cartController.minusItemInCart)
router.delete('/', mustRole('user'), cartController.clearItemInCart)

module.exports = router