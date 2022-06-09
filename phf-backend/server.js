const https = require("https");
const fs = require("fs");
const express = require("express");

const app = express();

app.get("/", (request, response) => {
    response.send("Hello from express server.");
});

app.listen(3000, () => {
  console.log("server is runing at port 3000");
});

