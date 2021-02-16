const express = require("express");
const Partner = require("../models/partner");
const partnerRouter = express.Router();
const authenticate = require("../authenticate");
const cors = require("./cors");

partnerRouter
  .route("/")
  .options(cors.corsWithOption, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Partner.find()
      .then((partner) => {
        res.statusCodes = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(partner);
      })
      .catch((err) => next(err));
  })
  .post(
    cors.corsWithOption,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Partner.create(req.body)
        .then((partner) => {
          console.log("Partner Created ", partner);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(partner);
        })
        .catch((err) => next(err));
    }
  )
  .put(
    cors.corsWithOption,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      res.statusCode = 403;
      res.end("PUT operation not supported on /partners");
    }
  )
  .delete(
    cors.corsWithOption,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Partner.deleteMany()
        .then((response) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch((err) => next(err));
    }
  );

partnerRouter
  .route("/:partnerId")
  .options(cors.corsWithOption, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Partner.findById(req.params.partnerId)
      .then((partner) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(partner);
      })
      .catch((err) => next(err));
  })
  .post(
    cors.corsWithOption,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      res.end(
        `Will add partner__${req.params.partnerId}: ${req.body.name}, ${req.body.discription} to the server`
      );
    }
  )
  .put(
    cors.corsWithOption,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Partner.findByIdAndUpdate(
        req.params.partnerId,
        {
          $set: req.body,
        },
        { new: true }
      )
        .then((partner) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(partner);
        })
        .catch((err) => next(err));
    }
  )
  .delete(
    cors.corsWithOption,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      Partner.findByIdAndDelete(req.params.partnerId)
        .then((response) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch((err) => next(err));
    }
  );

module.exports = partnerRouter;
