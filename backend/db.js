import mongoose from "mongoose"

async function connect(){
    await mongoose.connect("mongodb+srv://adityashrm500:fs3GapX0DSe7CZCD@paytm-cluster.9itqsso.mongodb.net/")
    try {
        console.log("db connected")
    } catch (error) {
        console.error("Error")
    }
}

//USER SCHEMA
const UserSchema = new mongoose.Schema({
    username: 
    {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        maxlength: 40,
        minlength: 3,
        trim: true,
    },

    password: 
    {
        type: String,
        required: true,
        minlength: 3,
        maxlength:40,
    },

    firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 40,
    },


    lastName: {
        type: String,
        required: true,
        trim: true, 
        maxlength: 40,
    }
})

const User = mongoose.model("User", UserSchema)



//ACCOUNT SCHEMA

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,    //refrence from User model
    required: true,
  },

  balance: {
    type: Number,
    required:true
  }
})


const Account = mongoose.model('accont', accountSchema)
export {connect, User, Account}
