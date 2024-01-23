import express from "express";
import morgan from "morgan";
import cors from "cors";
import handlebars from "express-handlebars";
import __dirname from "./__dirname.js";
import "dotenv/config";
import products from "./routes/products-routes.js";
import cart from "./routes/cart-routes.js";
import views from "./routes/views-routes.js";
const app = express();

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

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running at port ${process.env.PORT}`);
});
