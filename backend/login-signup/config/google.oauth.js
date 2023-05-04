const GoogleStrategy = require('passport-google-oauth20').Strategy;
require("dotenv").config()
const passport = require("passport")
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });

    const user = {
        name:profile.displayName,
        email:profile.emails[0].value,
        token:accessToken,
    }
    console.log(profile,"access",accessToken,"refresh",refreshToken)
    return cb(null, user);

  }
));

module.exports={
    passport
}