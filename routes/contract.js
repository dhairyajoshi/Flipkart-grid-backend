const express = require('express')

const router = express.Router()

const contractController = require('../controllers/contractController')

const authCheck = require('../middlewares/authCheck')

router.get('/rewardhistory', authCheck, contractController.getRewardHistory)

router.get('/gettokens', authCheck, contractController.getTokens)

module.exports = router 