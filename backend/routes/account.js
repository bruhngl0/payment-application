import express from "express"
import { Account } from "../db.js"
import { authMiddleware } from "../middleware.js"
const accountRouter = express.Router()
import mongoose from "mongoose"

accountRouter.get('/balance', authMiddleware,  async(req,res)=>{
    
    const result = await Account.findOne({userId: req.userId})
    if(!result){
        res.status(401).json("wrong request")
    }

    res.status(200).json({balance: result.balance}) 
})

accountRouter.get('/bulk', async(req,res)=>{
    const data = await Account.find({})
    if(!data){
        res.status(400).json("bad request")
    }

    res.status(200).json(data)
})




accountRouter.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
   
    session.startTransaction();
  
    const { amount, to } = req.body;   
 

    const parsedAmount = parseFloat(amount)
   

    if (typeof parsedAmount !== 'number' || isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json("Invalid amount");
    }
    // Fetch the accounts within the transaction
    const account = await Account.findOne({ userId: req.userId }).session(session);

    if (!account || account.balance < parsedAmount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }

    // Perform the transfer
    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -parsedAmount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: parsedAmount } }).session(session);

    // Commit the transaction
    await session.commitTransaction();
    res.json({
        message: "Transfer successful"
    });
});




export {
    accountRouter
}