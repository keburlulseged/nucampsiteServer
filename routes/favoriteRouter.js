const express = require("express");
const Favorite = require("../models/favorite");
const authenticate = require("../authenticate");
const cors = require("./cors");

const favoriteRouter = express.Router();

favoriteRouter
  .route("/")
  .options(cors.corsWithOption, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Favorite.find({ user: req.user?._id })
      .populate("user")
      .populate("campsites")
      .then((favorite) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(favorite);
      })
      .catch((err) => next(err));
  })
  .post(
    cors.corsWithOption,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Favorite.findOne({ user: req.user._id }).then((favorite) => {
        if (favorite) {
          req.body.forEach((campsite) => {
            if (!favorite.campsites.includes(campsite._id)) {
              favorite.campsites.push(campsite);
            }
          });
          favorite
            .save()
            .then((favorite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            })
            .catch((err) => next(err));
        } else {
          Favorite.create({ user: req.user_id }).then((favorite) => {
            req.body.forEach((campsite) => {
              favorite.campsites.push(campsite);
            });
            favorite
              .save()
              .then((favorite) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorite);
              })
              .catch((err) => next(err));
          });
        }
      });
    }
  )
  .put(
    cors.corsWithOption,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403;
      res.end(`PUT operation not supported on /favorites`);
    }
  )
  .delete(
    cors.corsWithOption,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Favorite.findOneAndDelete({ user: req.user._id })
        .then((favorite) => {
          res.statusCode = 200;
          if (favorite) {
            res.setHeader("Content-Type", "application/json");
            res.json(favorite);
          } else {
            res.setHeader("Content-Type", "text/plain");
            res.end("You do not have any favorites to delete");
          }
        })
        .catch((err) => next(err));
    }
  );

favoriteRouter
  .route("/:campsiteId")
  .options(cors.corsWithOption, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    res.statusCode = 403;
    res.end(
      `GET operation not supported on /favorites/${req.params.campsiteId}`
    );
  })
  .post(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
    console.log("User: ", req.user);
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          if (!favorite.campsites.includes(req.params.campsiteId)) {
            // add to array
            favorite.campsites.push(req.params.campsiteId);
            favorite
              .save()
              .then((favorite) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorite);
              })
              .catch((err) => next(err));
          } else {
            res.status = 200;
            res.setHeader("Content-Type", "application/json");
            res.end("That campsite is already in the list of favorites");
          }
        } else {
          Favorite.create({
            user: req.user._id,
            campsites: [req.params.campsiteId],
          })
            .then((favorites) => {
              // add to array
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorites);
            })
            .catch((err) => next(err));
        }
      })
      .catch((err) => next(err));
  })
  .put(
    cors.corsWithOption,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403;
      res.end(
        `PUT operation not supported on /favorites/${req.params.campsiteId}`
      );
    }
  )
  .delete(
    cors.corsWithOption,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Favorite.findOne({ user: req.user._id }).then((favorites) => {
        if (favorites) {
          favorites.campsites.filter(
            (campsite) => campsite !== req.params.campsiteId
          );
          favorites
            .save()
            .then((favorite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            })
            .catch((err) => next(err));
        } else {
          res.setHeader("Content-Type", "text/plain");
          res.end(`There are no favorites to delete`);
        }
      });
    }
  );

module.exports = favoriteRouter;
