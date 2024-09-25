const express = require("express");
const app = new express();
app.post("login", (req, res) => {
  const details = JSON.parse(req.body);
});
