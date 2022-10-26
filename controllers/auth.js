const bcrypt = require("bcryptjs");
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
      expiresIn: "5m"
    });

    let newRefreshToken = jwt.sign(payload, process.env.APP_SECRET, {
      expiresIn: 15 * 60
    });

    let newRefreshTokenArray = !cookies?.token
      ? user.refresh_token
      : user.refresh_token.filter((rt) => rt !== cookies.token);

    if (cookies?.token) {
      let refreshToken = cookies.token;
      let foundToken = await User.findOne({
        where: {
          refresh_token: refreshToken
        }
      });

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
}

module.exports = new AuthController();
