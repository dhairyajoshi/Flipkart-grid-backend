const userModel = require('../models/userModel')
const contract = require('./contractController')

module.exports.redeem = async (req, res, next) => {
    const userId = req.body.userId; 
    const amount = req.body.supercoins; 

    try {
        const senderUser = await userModel.findById(req.UserData.userId);
        const receiverUser = await userModel.findById(userId);

        if (!senderUser || !receiverUser) {
            return res.status(400).json({ msg: 'Invalid user ID' });
        }

        if (amount > senderUser.supercoins) {
            return res.status(400).json({ msg: 'Not enough Supercoins!' });
        }

        await contract.transfer(receiverUser.walletAddress, senderUser.walletAddress, amount);

        senderUser.supercoins -= amount;
        receiverUser.supercoins += amount;

        await senderUser.save();
        await receiverUser.save();

        res.status(200).json({ msg: 'Supercoins redeemed successfully' });
    } catch (err) {
        console.log(err);
        res.status(400).json({ msg: 'Error during Supercoin redemption' });
    }
}
