const express = require("express");
const promotionRouter = express.Router();

promotionRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res) => {
    res.end("Will send all promotions to you");
  })
  .post((req, res) => {
    res.end(`Will add the promotions: ${req.body.name}`);
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /promotions");
  })
  .delete((req, res) => {
    res.end("Deleting all promotions");
  });

promotionRouter
  .route("/:promotionId")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res) => {
    res.end(`Will send info about promotion__${req.params.promotionId}`);
  })
  .post((req, res) => {
    res.end(
      `Will add promotion__${req.params.promotionId} to the server`
    );
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end(
      `PUT operation not supported on /promotions/${req.params.promotionId}`
    );
  })
  .delete((req, res) => {
    res.end(`Deleting promotions__${req.params.promotionId}`);
  });

module.exports = promotionRouter;
