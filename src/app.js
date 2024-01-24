//Importaciones
import express from "express";
import morgan from "morgan";
import cors from "cors";
import handlebars from "express-handlebars";
import __dirname from "./__dirname.js";
import "dotenv/config";
import products from "./routes/products-routes.js";
import cart from "./routes/cart-routes.js";
import views from "./routes/views-routes.js";
import { Server } from "socket.io";
import ProductManager from "./model/ProductManager.js";

//Servidor Http
const app = express();
const httpServer = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running at port ${process.env.PORT}`);
});
let productos;
const initialData = async () => {
  productos = await ProductManager.getProducts();
};
//Servidor Socket
const socketServer = new Server(httpServer);
socketServer.on("connection", (socket) => {
  initialData();
  socket.emit("products", productos);
});

//Exportación de socket.io para poder usarlo en los endpoints:
export default socketServer;
// Middleware
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", products);
app.use("/api", cart);
app.use("/", views);

// Configuración de templates de vistas
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
