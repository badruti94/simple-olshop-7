const express = require('express')
const router = express.Router()
const authRoutes = require('./auth')
const itemRoutes = require('./item')
const cartRoutes = require('./cart')
const orderRoutes = require('./order')
const profileRoutes = require('./profile')

router.use('/auth', authRoutes)
router.use('/item', itemRoutes)
router.use('/cart', cartRoutes)
router.use('/order', orderRoutes)
router.use('/profile', profileRoutes)

module.exports = router