const express = require("express");
const app = express();

// Use memory to store metadata
global.directory = __dirname;
global.metaMap = new Map();

const routes = require("./routes");
routes(app);

let port = 8889;
app.listen(port, () => {
  console.log(`Audio server running at localhost:${port}`);
});
