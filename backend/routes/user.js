import express from 'express'
import {z} from 'zod'
const userRouter = express.Router()
import { User } from '../db.js'
import { Account } from '../db.js'
import {JWT_SECRET} from '../config.js'
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../middleware.js'





//SIGN UP USER

const signUpZod = z.object({
    username: z.string(),
    password: z.string(),
    firstname: z.string(),
    lastname: z.string()
})

userRouter.post('/signup', async(req,res)=> {
    const body = req.body
    const success = signUpZod.safeParse(body)
    if(!success){
       return res.status(400).send("invalid input")
    }
    const ExistingUser = await User.findOne({username: req.body.username})
    if(ExistingUser){
       return res.status(400).send("invalid input/ email already exists")
    }
    const dbUser = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstname,
        lastName: req.body.lastname,
    })
    
 

  
    await Account.create({
        userId: dbUser._id,
        balance: 1 + Math.random() * 100
    })


    const token = jwt.sign({
        userId: dbUser._id
      }, JWT_SECRET)
    return res.status(200).json({ 
        message: "user created successfully",
        token: token
    })
})



//SIGNIN USER

const signInZod = z.object({
    username: z.string(),
    password: z.string(),
    firstName: z.string(),
    lastName: z.string(),
 })


userRouter.post('/signin', async( req,res)=>{
    const body = req.body
    const result = signInZod.safeParse(body)
    if(!result){
        return res.status(400).send("invalid input")
    }
    const signInUser = await User.findOne({
        username: req.body.username
    })
    if(!signInUser){
        return res.status(400).send("user doesnt exist, please signup first")
    }
    const token = jwt.sign({id: signInUser._id}, JWT_SECRET)
    return res.status(200).json({
        id: signInUser._id,
        token: token
    })
}) 






//update username password
 
const updateZod = z.object({
    password: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
})

userRouter.put('/', authMiddleware, async(req,res)=>{
    const updateInfo = req.body
    const result = updateZod.safeParse(updateInfo)

    if(!result){
        res.status(403).send("invalid")
    }
    
    await User.findOneAndUpdate( req.body, {_id: req.userId},)
    res.status(200).json({message: "updated successfully"})
} )





//search regex

userRouter.get("/bulk", async(req,res)=>{
    const filter = req.query.filter || " "
    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })
    res.json({
        user: users.map((user)=> ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})


export {
    userRouter
}


// /api/v1/user/signup
// /api/v1/user/signin
// /api/v1/user/  