const mongoose = require('mongoose')
const User = require('../models/userModel')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require('../models/userModel');
const { Web3 } = require('web3');
const transactionModel = require('../models/transactionModel');
const web3 = new Web3('http://127.0.0.1:7545')
const contractController = require('../controllers/contractController')

function generateReferral(length) {
    return [...Array(length)].map(() => Math.random().toString(36)[2]).join('');
}

module.exports.signUp = async (req, res, next) => {
    try {
        check = await User.findOne({ email: req.body.email });

        if (check != null)
            return res.status(400).json({ msg: "email already exists!" });


        const refId = req.body.refId

        var referrar = ""
        if (refId) {
            referrar = await userModel.findOne({ referral_code: refId })

            if (!referrar)
                return res.status(400).json({ msg: 'Invalid referral code!' })
        }

        const hashed = await bcrypt.hash(req.body.password, 10);

        const newAccount = await web3.eth.accounts.create();

        var ref_code = generateReferral(12)
        var checkUser = await userModel.findOne({ referral_code: ref_code })

        while (checkUser) {
            ref_code = generateReferral(12)
            checkUser = await userModel.findOne({ referral_code: ref_code })
        }

        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            email: req.body.email,
            token: req.body.token,
            walletAddress: newAccount.address,
            role: req.body.role,
            phone: req.body.phone,
            password: hashed,
            referral_code: ref_code
        });

        await user.save();

        if (referrar != "") {
            await contractController.addReward(referrar.walletAddress, 50)
            await contractController.addReward(user.walletAddress, 50)
        }

        const token = jwt.sign(
            {
                email: user.email,
                userId: user._id,
            },
            process.env.jwt_key,
            { expiresIn: "60 days" }
        );

        res.status(201).json({
            msg: "user created successfully",
            token: token,
            user: user,
        });
    } catch (err) {
        res.status(500).json({ msg: 'some error occurred!' })
    }

};

module.exports.logIn = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (user == null) {
            return res.status(400).json({ msg: "Wrong credentials!" });
        }
        const chk = await bcrypt.compare(req.body.password, user.password);

        if (!chk) {
            return res.status(400).json({ msg: "Wrong credentials!" });
        }

        const token = jwt.sign(
            {
                email: user.email,
                userId: user._id,
            },
            process.env.jwt_key,
            { expiresIn: "60 days" }
        );

        res.status(200).json({
            msg: "logged in successfully",
            token: token,
            user: user,
        });
    } catch (err) {
        res.status(500).json({ msg: 'some error occurred!' })
    }

};

module.exports.getUser = async (req, res, next) => {
    try {
        user = await userModel.findById(req.UserData['userId'])
        res.status(200).json(user)
    }
    catch (err) {
        res.status(500).json({ msg: 'some error occurred!' })
    }
}

module.exports.getAllUser = async (req, res, next) => {
    try {
        users = await userModel.find().exec()
        res.status(200).json(users)
    } catch (err) {
        res.status(500).json({ msg: 'some error occurred!' })
    }
}

module.exports.updateUser = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.UserData['userId'])
        const fuser = await userModel.findOne({ username: req.body.username })

        if (fuser != null && user.id != fuser.id) {
            return res.status(400).json({
                'msg': 'username already exists'
            })
        }
        fuser = await userModel.findOne({ email: req.body.email })
        if (fuser != null && user.id != fuser.id) {
            return res.status(400).json({
                'msg': 'email already exists'
            })
        }

        user.name = req.body.name
        user.username = req.body.username
        user.email = req.body.email

        await user.save()

        res.status(200).json({
            'msg': 'user profile updated',
            'user': user
        })
    } catch (err) {
        res.status(500).json({ msg: 'some error occurred!' })
    }
}

module.exports.getAllOrders = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.UserData.userId);
        var orders = {}

        if (user.role === 'customer')
            orders = await transactionModel.find({ user: req.UserData.userId }).exec()
        else
            orders = await transactionModel.find({ seller_id: req.UserData.userId }).exec()

        res.status(200).json({ ...orders })
    } catch (err) {
        res.status(500).json({ msg: 'some error occurred!' })
    }
}