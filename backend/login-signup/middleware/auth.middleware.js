const jwt = require("jsonwebtoken")
require("dotenv").config()
const { UserModel } = require("../model/user.model")
const { client } = require("../config/redis")


const auth = async (req, res, next) => {









    const token = req.body.token;


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






const socketAuth = async(socket, next) => {


    const token = socket.handshake.query.token;

    if(!token) return next(new Error("Please Provide Token"));

    try {

        // if(token)
        // {
        //     const isTokenBlacklist = await client.get(token);
        //     console.log(isTokenBlacklist)
        //     if(isTokenBlacklist)
        //     {
        //         const logout = new Error("Please Login");
        //         return next(logout);
        //     }
        // }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {

            if (err) {
                return next(err);
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