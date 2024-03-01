import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { getDb } from './database';
import { ObjectId } from 'mongodb';

passport.use(
  new LocalStrategy(async (username, password, done) => {

    try {

      const user = await getDb().collection("users").findOne({ username: username });

      if (!user) {
        return done(null, false, { message: "No user with that username" });
      }

      if (!(await bcrypt.compare(password, user.password))) {
        return done(null, false, { message: "Wrong password" });
      }

      return done(null, user);

    } catch (error) {
      return done(error);
    }

  })

);

passport.serializeUser((user: any, done) => {

  done(null, user._id);

});

passport.deserializeUser(async (_id: ObjectId, done) => {

  try {

    const user = await getDb().collection("users").findOne(new ObjectId(_id));
    done(null, user);

  } catch (error) {
    done(error);
  }

});

export default passport;