/**
 * Este módulo inicializa la configuración de Passport.js para la autenticación de usuarios.
 */

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import UsersDao from "../dao/usersDao.js";
import PasswordManagement from "./passwordManagement.js";
import GithubStrategy from "passport-github2";
import { v4 as uuidv4 } from "uuid";

const initializaPassport = () => {
  // Estrategia de registro local
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, email, password, done) => {
        try {
          let { first_name, last_name, age, role } = req.body;
          age = parseInt(age);
          // Verifica que todos los campos requeridos estén presentes
          if (!first_name || !last_name || !email || !password || !age) {
            return done(null, false);
          }
          // Verifica si el correo electrónico ya está en uso
          const emailUsed = await UsersDao.getUserByEmail(email);

          if (emailUsed) {
            return done(null, false);
          }

          // Registra al usuario en la base de datos
          const user = await UsersDao.register(
            first_name,
            last_name,
            email,
            age,
            password,
            role
          );
          return done(null, user);
        } catch (error) {
          // Maneja errores durante el registro
          return done(error);
        }
      }
    )
  );

  // Estrategia de inicio de sesión local
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        try {
          // Verifica que se hayan proporcionado el correo electrónico y la contraseña
          if (!email || !password) {
            return done(null, false);
          }

          // Obtiene el usuario por correo electrónico
          const user = await UsersDao.getUserByEmail(email);
          // Valida la contraseña
          if (PasswordManagement.validatePassword(password, user?.password)) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        } catch (error) {
          // Maneja errores durante el inicio de sesión
          return done(error);
        }
      }
    )
  );

  // Estrategia de autenticación con GitHub
  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: "Iv1.a4e074b7057f062f",
        clientSecret: "3fca71b77346b74b1be965509b45134fd2f92350",
        callbackURL: "http://localhost:8080/api/sessions/githubCallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Intenta obtener el usuario por correo electrónico
          const user = await UsersDao.getUserByEmail(profile._json.email || "");
          if (!user) {
            // Si el usuario no existe, lo registra
            const newUser = {
              first_name: profile._json.name,
              last_name: " ",
              age: 18,
              email: profile._json.email ? profile._json.email : uuidv4(),
              password: " ",
            };

            const result = await UsersDao.register(
              newUser.first_name,
              newUser.last_name,
              newUser.email,
              newUser.age,
              newUser.password
            );
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          // Maneja errores durante la autenticación con GitHub
          return done(error);
        }
      }
    )
  );

  // Serializa al usuario para mantener la sesión
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // Deserializa al usuario para recuperar la sesión
  passport.deserializeUser(async (_id, done) => {
    try {
      // Obtiene el usuario por ID
      const user = await UsersDao.getUserByID(_id);
      done(null, user);
    } catch (error) {
      // Maneja errores durante la deserialización
      done(error);
    }
  });
};

export default initializaPassport;
