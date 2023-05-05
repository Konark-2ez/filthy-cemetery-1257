const mongoose = require("mongoose")


const userSchema = mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    occupation:{type:String},
    age:{type:Number},
    bank:{type:String},

},
{
    versionKey:false
}
)

const UserModel = mongoose.model("user",userSchema)


module.exports ={
    UserModel
}