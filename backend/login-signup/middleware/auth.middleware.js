const jwt = require("jsonwebtoken")
require("dotenv").config()
const { UserModel } = require("../model/user.model")
const { client } = require("../config/redis")


const auth = async (req, res, next) => {






    const token = req.cookies.token


    try {
        if (token) {

            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const { userId } = decoded

            if (decoded) {
                const isTokenBlacklist = await client.get(token);

                if (isTokenBlacklist) {
                    return res.status(400).send({ msg: "token blacklisted" });
                }
                const user = await UserModel.findById(userId)
                req.user = user
                next()
            } else {
                res.send({ "msg": "pls login first token is incorrect" })
            }
        } else {
            res.send({ "msg": "pls login first" })
        }
    }
    catch (error) {
        console.log(error.message)
        res.send({ "msg": error.message })
    }
}

const socketAuth = (socket, next) => {

    const token = socket.handshake.query.token;

    try {

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {

            if (err) {
                next(err);
            }

            if (decoded.user) {
                socket.handshake.query.userEmail = decoded.user;
                next()
            }


        })

    } catch (error) {

        next(error)

    }

}



module.exports = {
    auth,
    socketAuth
}