import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import UsersDao from "../dao/usersDao.js";
passport.use(
  new LocalStrategy(
    {
      passReqToCallback: true,
      usernameField: "email",
      passwordField: "password",
    },
    async (req, email, password, done) => {
      try {
        const { first_name, last_name, age } = req.body;
        const user = await UsersDao.getUserByEmail(email);

        if (!user || !user.validatePassword(password)) {
          return done(null, false, {
            message: "Correo electrónico o contraseña incorrectos.",
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
