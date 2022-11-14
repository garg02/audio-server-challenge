const express = require("express");
const router = express.Router();
const controller = require("./controller");

let routes = (app) => {
  router.post("/upload", controller.wavUpload);
  router.get("/media", controller.wavList);
  router.get("/filter", controller.wavFilter);
  router.get("/download/:name", controller.wavDownload);
  router.delete("/remove/:name", controller.wavDelete);

  app.use(router);
};

module.exports = routes;
