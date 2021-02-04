const express = require("express");
const partnerRouter = express.Router();

partnerRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res) => {
    res.end("Will send all partners to you");
  })
  .post((req, res) => {
    res.end(`Will add the partners: ${req.body.name}`);
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /partners");
  })
  .delete((req, res) => {
    res.end("Deleting all partners");
  });

partnerRouter
  .route("/:partnerId")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res) => {
    res.end(`Will send info about partner__${req.params.partnerId}`);
  })
  .post((req, res) => {
    res.end(`Will add partner__${req.params.partnerId} to the server`);
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /partners/${req.params.partnerId}`);
  })
  .delete((req, res) => {
    res.end(`Deleting partner__${req.params.partnerId}`);
  });

module.exports = partnerRouter;
