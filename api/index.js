const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

app.get("/test", (req, res) => {
  res.json("test ok");
});

app.post("/register", (req, res) => {});
app.listen(4000);

//chatappreact
