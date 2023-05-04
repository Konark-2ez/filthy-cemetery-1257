const express=require('express')
const {Server}=require("socket.io")
const http = require("http")
const app=express()
const server= http.createServer(app)
const io = new Server(server)
io.on("connection",(socket)=>{
    socket.on("chat",(name,msg)=>{
        socket.emit("recived_msg",name,msg)
        socket.broadcast.emit("recived_msg",name,msg)
    })
})
server.listen(8000,()=>{
    console.log("Connectet to 8000")
})