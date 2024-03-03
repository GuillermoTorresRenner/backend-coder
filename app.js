//Importaciones
import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import cors from "cors";
import handlebars from "express-handlebars";
import __dirname from "./__dirname.js";
import "dotenv/config";
import products from "./src/routes/products-routes.js";
import cart from "./src/routes/cart-routes.js";
import messages from "./src/routes/messages-routes.js";
import routerSessions from "./src/routes/sessions-routes.js";
import views from "./src/routes/views-routes.js";
import { Server } from "socket.io";
import ProductsDao from "./src/dao/productDao.js";
import MessagesDao from "./src/dao/messagesDao.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import initializaPassport from "./src/utils/passport.config.js";

//Servidor Http
const app = express();
const httpServer = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running at port ${process.env.PORT}`);
});
let productos;
let mensajes;
const initialData = async () => {
  productos = await ProductsDao.getAllProducts();
};

const initialMessages = async () => {
  mensajes = await MessagesDao.getAllMessages();
};
//Servidor Socket
const socketServer = new Server(httpServer);
socketServer.on("connection", (socket) => {
  initialData();
  socket.emit("products", productos);
  initialMessages();
  socket.emit("messages", mensajes);
});

//Conexión a la base de datos
// const uri = "mongodb://localhost:27017/ecommerce?authSource=admin"; //Poner el nombre del contenedor de mongo en docker en vez de localhost
const uri =
  "mongodb+srv://LeBateleur:Arcanum@ecommerce.zzmhvav.mongodb.net/ecommerce?retryWrites=true&w=majority";

mongoose.set("strictQuery", false);

mongoose.connect(uri).then(
  () => {
    console.log("Conectado a DB");
  },
  (err) => {
    console.log(err);
  }
);
//Exportación de socket.io para poder usarlo en los endpoints:
export default socketServer;
// Middleware
app.use(cookieParser());
app.use(
  session({
    secret: "secreto",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: uri,
      ttl: 60 * 60 * 24,
    }),
  })
);
initializaPassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", products);
app.use("/api", cart);
app.use("/api", messages);
app.use("/api", routerSessions);
app.use("/", views);

// Configuración de templates de vistas
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/src/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
