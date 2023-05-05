
const express = require("express")
const cors = require("cors")
require("dotenv").config()
const jwt = require("jsonwebtoken")
const {connection} = require("./config/db")
const {userRouter} = require("./routers/user.route")
const {auth} = require("./middleware/auth.middleware")
const {passport} = require("./config/google.oauth")
const cookieParser = require('cookie-parser')
const app = express()

app.use(cookieParser());
app.use(cors())
app.use(express.json())

app.use("/users",userRouter)

app.get("/",auth,(req,res)=>{
  console.log(req.user)
    res.sendFile("C:/Users/ABDUL HASEEB T K/OneDrive/Desktop/filthy-cemetery-1257/frontend/index.html")
})




// refresh token
app.get("/getnewtoken", (req, res) => {
    const refreshtoken = req.cookies.refreshtoken
    console.log(refreshtoken)
   try {
   if(refreshtoken){
    const decoded = jwt.verify(refreshtoken, process.env.REFRESH_SECRET)
    console.log(decoded)
    if(decoded){
      const token = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, {
        expiresIn: 60
      });
      res.cookie("token",token)
       res.send(token)
    }
    else{
      res.send("invalid refresh token, plz login again")
    }
   }else{
    res.send({"msg":"pls login again"})
   }
   } catch (error) {
      res.send({'msg':error.message})
   }
  })

//   google oauth

app.get('/auth/google',
passport.authenticate('google', { scope: ['profile','email'] }));

app.get('/auth/google/callback', 
passport.authenticate('google', { failureRedirect: '/login' ,session:false}),
function(req, res) {
  // Successful authentication, redirect home.
    
  
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });
    console.log(token)
    res.cookie('token',token)
  // res.redirect('/');
  res.sendFile("C:/Users/ABDUL HASEEB T K/OneDrive/Desktop/filthy-cemetery-1257/frontend/index.html")
});



app.listen(8080,async() =>{
    try {
        await connection
        console.log("server connected to db")
    } catch (error) {
        console.log(error.message)
    }
    console.log(`server is connected to port ${process.env.port} `)
})