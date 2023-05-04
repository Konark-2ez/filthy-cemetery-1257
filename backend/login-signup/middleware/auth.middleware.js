const jwt=require("jsonwebtoken")
require("dotenv").config()




const auth= (req,res,next)=>{
           
    const token=req.cookies.token
    console.log(token);
   
try {
    if(token){
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        // console.log(decoded)
        if(decoded){
            next()
        }else{
            res.send({"msg":"pls login first token is incorrect"})
        }
    }else{
        res.send({"msg":"pls login first"})
    }
}
 catch (error) {
    console.log(error.message)
    res.send({"msg":error.message})
}
}
   


module.exports={
    auth
}