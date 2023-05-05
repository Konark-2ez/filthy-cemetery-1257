const redis = require("redis");
const Redis = require("ioredis");
require("dotenv").config();

let configuration = {
    host:process.env.HOST,
    port:process.env.redisport,
    username:"default",
    password:process.env.REDIS_PASSWORD
}
const client = new Redis(configuration)

client.on("connect", async() => {
  console.log("Connected to redis");
});

client.on("error", (error) => {
  console.error("RedisLabs connection error:", error);
});





module.exports = { client };