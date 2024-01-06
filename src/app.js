const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

// Middleware
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", require("./routes/products-routes.js"));
("iaas");

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.listen(3000, () => {
  console.log("Server running at port 3000");
});
