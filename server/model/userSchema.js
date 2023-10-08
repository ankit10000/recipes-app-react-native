const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    fullName: {
        type:String,
        required:true
    },
    contactNumber: {
        type:String,
        required:true
    },
    emailAddress: {
        type:String,
        required:true
    },
    city: {
        type:String,
        required:true
    },
    state: {
        type:String,
        required:true
    },
    postal: {
        type:String,
        required:true
    },
    formId: {
        type:String,
        required:true
    },
    password: {
        type:String,
        required:true,
    },
    confirmPassword: {
        type:String,
        required:true,
    },
    tokens:    [{
        token: {
            type:String,
            required:true,
        }
    }]
},{ timestamps: true })

userSchema.pre('save', async function (next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 12)
        this.confirmPassword = await bcrypt.hash(this.confirmPassword, 12)
    }
    next();
})

userSchema.methods.generateAuthToken = async function(){
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({token:token})
        await this.save()
        return token;
    } catch (err) {
        console.log(err)
    }
}

const User = mongoose.model('USER',userSchema)

module.exports = User;
// const userSchema = new mongoose.Schema({
//     namePrifix: {
//         type:String,
//         required:true
//     },
//     firstName: {
//         type:String,
//         required:true
//     },
//     lastName: {
//         type:String,
//         required:true
//     },
//     contactNumber: {
//         type:String,
//         required:true
//     },
//     emailAddress: {
//         type:String,
//         required:true
//     },
//     address: {
//         type:String,
//         required:true
//     },
//     addressCity: {
//         type:String,
//         required:true
//     },
//     addressState: {
//         type:String,
//         required:true
//     },
//     addressPostal: {
//         type:String,
//         required:true
//     },
//     usertimeInput: {
//         type:String,
//         required:true
//     },
//     userdateInput: {
//         type:String,
//         required:true
//     },
//     formId: {
//         type:String,
//         required:true
//     },
// },{ timestamps: true })