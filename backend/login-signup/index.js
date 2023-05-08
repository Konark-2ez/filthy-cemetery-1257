
const express = require("express")
const cors = require("cors")
const http = require('http');
const { Server } = require("socket.io")
require("dotenv").config()
const jwt = require("jsonwebtoken")
const {connection} = require("./config/db")
const {userRouter} = require("./routers/user.route")
const {auth, socketAuth} = require("./middleware/auth.middleware")
const {passport} = require("./config/google.oauth")
const cookieParser = require('cookie-parser');
const {BudgetModel} = require('./model/budget.model')
const app = express();

// Connected established b/w express and socket.io
const server = http.createServer(app);
const io = new Server(server);

app.use(cookieParser());
app.use(cors())
app.use(express.json())

app.use("/users",userRouter)


app.get("/",auth,(req,res)=>{
  console.log(req.user)
    res.sendFile("C:/Users/ABDUL HASEEB T K/OneDrive/Desktop/filthy-cemetery-1257/frontend/index.html")
})



// ***************************** new - socket ******************************** //

io.use(socketAuth);

io.on('connection',async(socket)=>{
  
  console.log("Client Connected");

  // getting the default data of the user
  const {userEmail} = socket.handshake.query;
  const userData = await BudgetModel.findOne({user:userEmail});
  socket.emit('defaultBudget', JSON.stringify(userData));

  // Budget amt update
  socket.on('budgetAmt',async(budgetamt)=>{

    userData.budget = budgetamt;
    userData.balance = budgetamt - userData.expenses;
    await BudgetModel.findOneAndUpdate({user:userEmail}, userData);

    socket.emit('updatedBudget',JSON.stringify(await BudgetModel.findOne({user:userEmail})));

  });

  // Expenses Upadate
  socket.on('expenses',async(rawExpenses)=>{

    rawExpenses = JSON.parse(rawExpenses);
    const {expenseAmt, transactionDetails} = rawExpenses;

    userData.expenses += expenseAmt;
    userData.transactions.push(transactionDetails);
    userData.balance = userData.budget - userData.expenses;

    await BudgetModel.findOneAndUpdate({user:userEmail}, userData);
    socket.emit('expenseDeduct',JSON.stringify(await BudgetModel.findOne({user:userEmail})));
  });

  // Transactions Update
  socket.on('removeExpenses', async(data)=>{
    data = JSON.parse(data);
    // console.log(data.amt);

    userData.transactions = data.filtered;
    userData.expenses -= data.amt;
    userData.balance += data.amt;


    await BudgetModel.findOneAndUpdate({user:userEmail}, userData);
    socket.emit('updatedExpenses',JSON.stringify(await BudgetModel.findOne({user:userEmail})));
  })

  // console.log(userData)

})


// ***************************** new - socket ******************************** //





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



server.listen(8080,async() =>{
    try {
        await connection
        console.log("server connected to db")
    } catch (error) {
        console.log(error.message)
    }
    console.log(`server is connected to port ${process.env.port} `)
})