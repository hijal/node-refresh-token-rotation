const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models").user;

class AuthService {
  async create(payload) {
    let salt = await bcrypt.genSalt(10);
    let hp = await bcrypt.hash(payload.password, salt);
    delete payload.password;
    payload.password = hp;

    let user = await User.create(payload);

    return user;
  }

  async login({ email, password }, cookies, res) {
    // res.cookie("hello", "world", { httpOnly: true, secure: true, maxAge: 24 * 60 * 60 * 1000 });
    let user = await User.findOne({
      where: {
        email
      }
    });

    if (!user) {
      throw new Error("User not found");
    }

    let validatePassword = await bcrypt.compare(password, user.password);

    if (!validatePassword) {
      throw new Error("Invalid Credentials");
    }
    let payload = {
      id: user.id
    };
    let token = jwt.sign(payload, process.env.APP_SECRET, {
      expiresIn: "5m"
    });
    const refreshToken = jwt.sign(payload, process.env.APP_SECRET, {
      expiresIn: 15 * 60
    });

    return { token };
  }
}

module.exports = new AuthService();
