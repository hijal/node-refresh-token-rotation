const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const cuid = require("cuid");

const User = require("../models").user;
const logger = require("../utils/logger")();

class AuthController {
  async login(req, res) {
    logger.info(`login payload ${JSON.stringify(req.body)}`);
    let { email, password } = req.body;

    let cookies = req.cookies;
    logger.info(`available cookies ${JSON.stringify(cookies)}`);

    if (!email || !password) {
      logger.info("login required fields are missing.");
      throw new Error("Login required fields are missing");
    }

    let user = await User.findOne({
      where: {
        email
      }
    });

    if (!user) {
      logger.info("User is not found");
      throw new Error("User not found");
    }

    let validatePassword = await bcrypt.compare(password, user.password);

    if (!validatePassword) {
      logger.info("credentials are invalid");
      throw new Error("Invalid Credentials");
    }

    let payload = {
      user_key: user.user_key
    };

    let token = jwt.sign(payload, process.env.APP_SECRET, {
      expiresIn: "1m"
    });

    let newRefreshToken = jwt.sign(payload, process.env.APP_SECRET, {
      expiresIn: "10m"
    });

    let newRefreshTokenArray = !cookies?.token
      ? user.refresh_token
      : user.refresh_token.filter((rt) => rt !== cookies.token);

    if (cookies?.token) {
      logger.info("token available in cookie");
      let refreshToken = cookies.token;
      let foundToken = user.refresh_token.includes(refreshToken);

      if (!foundToken) {
        logger.info("Attempted refresh token reuse at login.");
        newRefreshTokenArray = [];
      }
      res.clearCookie("token", {
        httpOnly: true,
        secure: true
      });
    }

    await user.update({
      refresh_token: [...newRefreshTokenArray, newRefreshToken]
    });

    res.cookie("token", newRefreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000
    });

    return {
      accessToken: token
    };
  }

  async create(req, res) {
    let payload = req.body;
    let salt = await bcrypt.genSalt(10);
    let hp = await bcrypt.hash(payload.password, salt);
    delete payload.password;
    payload.password = hp;
    payload.user_key = `ukey-${cuid()}`;

    let user = await User.create(payload);

    return user;
  }

  async refresh(req, res) {
    let cookies = req.cookies;

    if (!cookies?.token) {
      throw new Error("Unauthorized");
    }

    let refreshToken = cookies.token;

    res.clearCookie("token", {
      httpOnly: true,
      secure: true
    });

    let user = await User.findOne({
      where: {
        refresh_token: {
          [Op.contains]: refreshToken
        }
      }
    });

    if (!user) {
      jwt.verify(refreshToken, process.env.APP_SECRET, async (err, decoded) => {
        if (err) {
          throw new Error("Forbidden");
        }
        logger.info("Attempted to refresh the token for reuse");
        let userHacked = await User.findOne({
          where: {
            user_key: decoded.user_key
          }
        });
        await userHacked.update({
          refresh_token: []
        });
      });
      throw new Error("Forbidden");
    }

    const newRefreshTokenArray = user.refresh_token.filter((rt) => rt !== refreshToken);
    let accessToken = "",
      newRefreshToken = "";

    jwt.verify(refreshToken, process.env.APP_SECRET, async (err, decoded) => {
      if (err) {
        logger.info("expired refresh token");
        await user.update({
          refresh_token: [...newRefreshTokenArray]
        });
      }

      if (err || decoded.user_key !== user.user_key) {
        throw new Error("forbidden");
      }
      let payload = {
        user_key: decoded.user_key
      };

      accessToken = jwt.sign(payload, process.env.APP_SECRET, {
        expiresIn: "5m"
      });

      newRefreshToken = jwt.sign(payload, process.env.APP_SECRET, {
        expiresIn: "10m"
      });

      await user.update({
        refresh_token: [...newRefreshTokenArray, newRefreshToken]
      });
    });

    res.cookie("token", newRefreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000
    });

    return { accessToken };
  }

  async logout(req, res) {
    let cookies = req.cookies;

    if (!cookies?.token) {
      throw new Error("No content");
    }

    let refreshToken = cookies.token;

    let user = await User.findOne({
      where: {
        refresh_token: {
          [Op.contains]: refreshToken
        }
      }
    });

    if (!user) {
      res.clearCookie("token", {
        httpOnly: true,
        secure: true
      });
      throw new Error("No content");
    }

    let filterRefreshTokens = user.refresh_token.filter((rt) => rt !== refreshToken);

    await user.update({
      refresh_token: [...filterRefreshTokens]
    });

    res.clearCookie("token", {
      httpOnly: true,
      secure: true
    });

    res.status(204);
  }
}

module.exports = new AuthController();
