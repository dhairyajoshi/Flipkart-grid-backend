const express = require('express')

const router = express.Router()

const partnerController = require('../controllers/partnerController')

const partnerCheck = require('../middlewares/partnerCheck')

router.post('/redeem', partnerCheck, partnerController.redeem)



module.exports = router 