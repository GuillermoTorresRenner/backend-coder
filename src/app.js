const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", require("./routes/products-routes.js"));
app.use("/api", require("./routes/cart-routes.js"));

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running at port ${process.env.PORT}`);
});
