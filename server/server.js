const express = require("express");
// const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(express.static('client/build'));

app.get('/ping', function (req, res) {
  return res.send('pong');
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

module.exports = app;