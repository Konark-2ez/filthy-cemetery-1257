const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { client } = require("./config/redis");
const { connection } = require("./config/db");
const { userRouter } = require("./routers/user.route");
const { auth, socketAuth } = require("./middleware/auth.middleware");
const { passport } = require("./config/google.oauth");
const cookieParser = require("cookie-parser");
const { BudgetModel } = require("./model/budget.model");
const app = express();

// Connected established b/w express and socket.io
const server = http.createServer(app);
const io = new Server(server);

app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server in live" });
});

app.use("/users", userRouter);

// app.get("/",auth,(req,res)=>{
//     res.sendFile("C:/Users/ABDUL HASEEB T K/OneDrive/Desktop/filthy-cemetery-1257/frontend/index.html")
// })

// ***************************** new - socket ******************************** //

io.use(socketAuth);

io.on("connection", async (socket) => {
  console.log("Client Connected");

  // getting the default data of the user
  const { userEmail } = socket.handshake.query;

  // Function to fetch user data from Redis or the database if not available in cache
  const fetchUserData = async () => {
    return new Promise((resolve, reject) => {
      client.get(userEmail, async (err, cachedData) => {
        if (err) {
          console.error("Error fetching data from Redis:", err);
          reject(err);
        } else if (cachedData !== null) {
          // Data found in cache
          resolve(JSON.parse(cachedData));
        } else {
          // Data not found in cache, fetch from the database and cache it
          const userFetchedData = await BudgetModel.findOne({
            user: userEmail,
          });
          client.setex(userEmail, 3600, JSON.stringify(userFetchedData)); // Cache data for an hour (3600 seconds)
          resolve(userFetchedData);
        }
      });
    });
  };

  // Get the default data
  const userData = await fetchUserData();
  socket.emit("defaultBudget", JSON.stringify(userData));

  // Budget amt update
  socket.on("budgetAmt", async (budgetamt) => {
    userData.budget = budgetamt;
    userData.balance = budgetamt - userData.expenses;

    await BudgetModel.findOneAndUpdate({ user: userEmail }, userData);
    client.setex(userEmail, 3600, JSON.stringify(userData)); // Update the cached data
    const upDatedUserData = await fetchUserData();
    socket.emit("updatedBudget", JSON.stringify(upDatedUserData));
  });

  // Expenses Upadate
  socket.on("expenses", async (rawExpenses) => {
    rawExpenses = JSON.parse(rawExpenses);
    const { expenseAmt, transactionDetails } = rawExpenses;

    userData.expenses += expenseAmt;
    userData.transactions.push(transactionDetails);
    userData.balance = userData.budget - userData.expenses;

    await BudgetModel.findOneAndUpdate({ user: userEmail }, userData);
    client.setex(userEmail, 3600, JSON.stringify(userData)); // Update the cached data
    const userDataAfterAddingExpense = await fetchUserData();
    socket.emit("expenseDeduct", JSON.stringify(userDataAfterAddingExpense));
  });

  // Transactions Update
  socket.on("removeExpenses", async (data) => {
    data = JSON.parse(data);

    userData.transactions = data.filtered;
    userData.expenses -= data.amt;
    userData.balance += data.amt;

    await BudgetModel.findOneAndUpdate({ user: userEmail }, userData);
    client.setex(userEmail, 3600, JSON.stringify(userData)); // Update the cached data
    const userDataAfterRemovedExpense = await fetchUserData();
    socket.emit("updatedExpenses", JSON.stringify(userDataAfterRemovedExpense));
  });

  socket.on("updateExpenses", async (data) => {
    data = JSON.parse(data);

    userData.transactions = data.newData;
    userData.expenses += data.amt;
    userData.balance -= data.amt;

    await BudgetModel.findOneAndUpdate({ user: userEmail }, userData);
    client.setex(userEmail, 3600, JSON.stringify(userData)); // Update the cached data
    const updatedExpenseData = await fetchUserData();
    socket.emit("updatedExpenses", JSON.stringify(updatedExpenseData));
  });
});

// ***************************** new - socket ******************************** //

// refresh token
app.get("/getnewtoken", (req, res) => {
  const refreshtoken = req.cookies.refreshtoken;
  try {
    if (refreshtoken) {
      const decoded = jwt.verify(refreshtoken, process.env.REFRESH_SECRET);
      if (decoded) {
        const token = jwt.sign(
          { userId: decoded.userId },
          process.env.JWT_SECRET,
          {
            expiresIn: 60,
          }
        );
        res.cookie("token", token);
        res.send(token);
      } else {
        res.send("invalid refresh token, plz login again");
      }
    } else {
      res.send({ msg: "pls login again" });
    }
  } catch (error) {
    res.send({ msg: error.message });
  }
});

//   google oauth

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  function (req, res) {
    // Successful authentication, redirect home.

    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token);
    // res.redirect('/');
    res.sendFile(
      "C:/Users/ABDUL HASEEB T K/OneDrive/Desktop/filthy-cemetery-1257/frontend/index.html"
    );
  }
);

server.listen(8080, async () => {
  try {
    await connection;
    console.log("server connected to db");
  } catch (error) {
    console.log(error.message);
  }
  console.log(`server is connected to port ${process.env.port} `);
});
