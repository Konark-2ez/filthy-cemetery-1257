const GoogleStrategy = require('passport-google-oauth20').Strategy;
require("dotenv").config()
const passport = require("passport")
const {UserModel} =require("../model/user.model")

const { v4: uuidv4 } = require('uuid');


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
    const email=profile.emails[0].value
     const userexist = await UserModel.findOne({email})
       console.log(userexist)
    if(!userexist){
      const data = {
        name:profile.displayName,
        email:profile.emails[0].value,
        password:uuidv4()
    }

    const user = new UserModel(data)
    await user.save()
    return cb(null, user);
    }else{
     const user=userexist
      return cb(null, user);
    }
    
    // console.log(profile,"access",accessToken,"refresh",refreshToken)
  

  }
));

module.exports={
    passport
}