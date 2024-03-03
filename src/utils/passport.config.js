import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import UsersDao from "../dao/usersDao.js";
import PasswordManagement from "./passwordManagement.js";
const initializaPassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, email, password, done) => {
        try {
          let { first_name, last_name, age } = req.body;
          age = parseInt(age);
          if (!first_name || !last_name || !email || !password || !age) {
            return done(null, false);
          }
          const emailUsed = await UsersDao.getUserByEmail(email);

          if (emailUsed) {
            return done(null, false);
          }

          const user = UsersDao.register(
            first_name,
            last_name,
            email,
            age,
            password
          );
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        try {
          if (!email || !password) {
            return done(null, false);
          }

          const user = await UsersDao.getUserByEmail(email);
          if (PasswordManagement.validatePassword(password, user?.password)) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (_id, done) => {
    try {
      const user = await UsersDao.getUserByID(_id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

export default initializaPassport;
