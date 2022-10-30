/* eslint-disable no-console */
const express = require("express");
const { join } = require("path");
const morgan = require("morgan");
const checkPermissions = require("./src/middleware/permissions.js");
const app = express();

app.use(morgan("dev"));
app.use(express.static(join(__dirname, "dist")));

app.use((_, res) => {
  res.sendFile(join(__dirname, "dist", "index.html"));
});

app.get('/admin', checkPermissions(["update:games", "create:games"]), (_, res) => {
  res.sendFile(join(__dirname, "dist", "index.html"));
});

app.listen(3000, () => console.log("Listening on port 3000"));
