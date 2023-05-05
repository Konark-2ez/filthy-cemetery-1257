const mongoose = require("mongoose")


const budgetSchema = mongoose.Schema({
    budget:{type:Number, default:0},
    expenses:{type:Number, default:0},
    balance:{type:Number,default:0},
    transactions:[{
        name:{type:String},
        amount:{type:Number},
        date:{type:Date, default:Date.now}
    }],
    user:{type:String, required:true}
},
{
    versionKey:false
}
)

const BudgetModel = mongoose.model("Budget",budgetSchema)


module.exports ={
    BudgetModel
}