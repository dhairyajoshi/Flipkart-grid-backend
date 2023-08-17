const { Web3 } = require('web3')

const contractABI = require('../contractabi.json');
const userModel = require('../models/userModel');

const contractAddress = process.env.contract_address

const web3 = new Web3('http://127.0.0.1:7545')
const senderAddress = process.env.metamask_address;
const privateKey = process.env.metamask_key.toString();
const contract = new web3.eth.Contract(contractABI, contractAddress);

function convertTime(timestamp) {
    const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const year = date.getFullYear();

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

module.exports.addReward = async (receiverAddress, amount) => {
    try {
        const gasPrice = await web3.eth.getGasPrice();
        const nonce = await web3.eth.getTransactionCount(senderAddress, 'pending');
        const txObject = {
            from: senderAddress,
            to: contractAddress,
            data: contract.methods['mint'](receiverAddress, amount).encodeABI(),
        };

        const signedTx = await web3.eth.accounts.signTransaction(
            {
                ...txObject,
                nonce: web3.utils.toHex(nonce),
                gasPrice: web3.utils.toHex(gasPrice),
                gasLimit: web3.utils.toHex(672197498),
                value: '0x0',
            },
            privateKey
        );

        await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    } catch (err) {
        console.error(err);
    }


}

module.exports.getRewardHistory = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.UserData.userId)

        const address = user.walletAddress

        const result = await contract.methods.earningHistory(address).call()
        earningHistory = []
        for (var i = 0; i < result['earningHistory'].length; i++) {
            earningHistory.push({
                tokens: result['earningHistory'][i]['amount'].toString(),
                createdAt: convertTime(result['earningHistory'][i]['createAt'].toString()),
                expiryDate: convertTime(result['earningHistory'][i]['expiryDate'].toString()),
                from: result['earningHistory'][i]['from'].toString() === process.env.metamask_address ? 'Flipkart Reward Points' : 'Customer Loyalty Points'
            })
        }
        const response = {
            totalEarning: result['totalEarning'].toString(),
            earningHistory
        }
        res.json({ ...response })
    } catch (err) {
        console.log(err)
        res.json({ msg: "error occurred" })
    }


}

module.exports.getTokens = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.UserData.userId)

        const address = user.walletAddress
        gasLimit = await contract.methods.expireTokens(address).estimateGas({ from: senderAddress })
        await contract.methods.expireTokens(address).send({ from: senderAddress, gas: gasLimit + BigInt(100000) })
        const result = await contract.methods.viewTokens(address).call()
        tokens = result.toString()
        user.supercoins = tokens
        user.save()
        res.status(200).json({ tokens })
    } catch (err) {
        console.log(err)
        res.json({ msg: "error occurred" })
    }
}

module.exports.transfer = async (sender, receiver = senderAddress, amount) => {
    await contract.methods.expireTokens(sender).send({ from: senderAddress })
    const avl = await contract.methods.viewTokens(sender).call()
    if (avl >= amount) {
        gasLimit = await contract.methods.transferFrom(sender, receiver, amount).estimateGas({ from: senderAddress })
        await contract.methods.transferFrom(sender, receiver, amount).send({ from: senderAddress, gas: gasLimit })
    }

    else
        throw ('Not Enough Tokens')
} 