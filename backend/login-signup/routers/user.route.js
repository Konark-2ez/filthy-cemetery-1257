const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { BudgetModel } = require("../model/budget.model");
const { UserModel } = require("../model/user.model");
// const { client } = require("../config/redis");    Redis removed, logout route is no longer needed

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userexist = await UserModel.findOne({ email });

    if (userexist) {
      res.status(200).json({ message: "User already exists" });
    } else {
      const hashpassword = bcrypt.hashSync(password, 5);
      req.body.password = hashpassword;

      const user = new UserModel(req.body);
      await user.save();

      // Adding defalut budget {
      const defaultBudget = {
        budget: 0,
        expenses: 0,
        balance: 0,
        transactions: [],
        user: user.email,
      };

      const saveBudget = new BudgetModel(defaultBudget);
      await saveBudget.save();

      res.status(200).json({ message: "user successfully registered" });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      res
        .status(401)
        .send({ message: "User does not exists, Please Register" });
      return;
    }

    const password_match = await bcrypt.compare(password, user.password);

    if (password_match) {
      const token = jwt.sign(
        { userId: user._id, user: user.email },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      const refreshtoken = jwt.sign(
        { userId: user._id, user: user.email },
        process.env.REFRESH_SECRET,
        {
          expiresIn: "7d",
        }
      );
      let name = user.name;

      res.cookie("token", token);
      res.cookie("refreshtoken", refreshtoken);

      res.send({
        msg: "login successfully",
        token: token,
        refreshtoken: refreshtoken,
        name: name,
      });
    } else {
      res.status(401).json({ message: "Invalid  password" });
    }
  } catch (error) {
    res.status(401).json({ msg: error.message });
  }
});

// logout

// userRouter.post("/logout", async (req, res) => {
//   try {
//     const token = req.body.token;
//     if (!token) return res.status(403);

//     await client.set(token, token);
//     res.json({ status: "logout successful" });
//   } catch (err) {
//     res.send(err.message);
//   }
// });

module.exports = {
  userRouter,
};
