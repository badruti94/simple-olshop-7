const express = require('express')
const router = express.Router()

const profileController = require('../controllers/profile')
const { mustRole } = require('../middlewares/auth')

router.get('/', mustRole('user'), profileController.getProfile)
router.put('/', mustRole('user'), profileController.updateProfile)

module.exports = router