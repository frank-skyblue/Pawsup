const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { UserModel } = require("../models/UserModel");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await UserModel.getUserByUsername(username);
      if (!user) {
        // No user found
        return done(null, null);
      }

      // TODO: Check if password matches using bcrypt (to encrypt passwords)
      if (user.password === password) {
        delete user.password;
        return done(null, user.cleanCopy());
      } else {
        return done(null, null);
      }
    } catch(err) {
        console.error(err);
        return done(err, null);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.uid);
});

passport.deserializeUser(async (uid, done) => {
  try {
    const user = await UserModel.getUserByID(uid);
    delete user.password;
    done(null, user.cleanCopy());
  } catch (err) {
    console.error(err);
    done(err, null);
  }
});

exports.passport = passport;
