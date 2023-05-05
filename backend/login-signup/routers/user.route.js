const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { UserModel } = require("../model/user.model")
const userRouter = express.Router()


userRouter.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body

        const userexist = await UserModel.findOne({ email })
        console.log(userexist)
        if (userexist) {
            res.status(200).send({ "message": 'User already exists' });
        } else {
            const hashpassword = bcrypt.hashSync(password, 5)
            req.body.password = hashpassword

            console.log(req.body.password)

            const user = new UserModel(req.body)
            await user.save()
            res.status(200).send({ "message": 'user successfully registered' })
        }
    }
    catch (error) {
        res.status(400).send({ "message": error.message })
    }
})


userRouter.post("/login", async (req, res) => {

    try {
        const { email, password } = req.body


        const user = await UserModel.findOne({ email })
        if (!user) {
            res.status(401).send({ "message": 'Invalid username ' });
        }

        const password_match = await bcrypt.compare(password, user.password)

        if (password_match) {
            console.log(user._id)
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
                expiresIn: "60s"
            });

            const refreshtoken = jwt.sign({ userId: user._id }, process.env.REFRESH_SECRET, {
                expiresIn: "120s"
            });

            res.cookie("token", token)
            res.cookie("refreshtoken", refreshtoken)

            res.send({ "msg": "login successfully", "token": token, "refreshtoken": refreshtoken })
        } else {
            res.status(401).send({ "message": 'Invalid  password' });
        }

    } catch (error) {
        res.status(401).send({ "msg": error.message });
    }

})



module.exports = {
    userRouter
}
