const jwt = require("jsonwebtoken");

const User = require("../models").user;
const err = require("../utils/err");

const authenticate = (req, res, next) => {
  const token = req.headers.authorization || req.headers.Authorization;

  if (!token) {
    return res.status(401).send(err('authorized', 401));
  }

  jwt.verify(token, process.env.APP_SECRET, async (error, decoded) => {
    if (error) {
      return res.status(403).send(err("forbidden", 403));
    }
    let user = await User.findOne({
      where: {
        user_key: decoded.user_key
      }
    });

    if (!user) {
      return res.status(404).send(err("not found", 404));
    }
    req.user = user;
    next();
  });
};

module.exports = authenticate;
