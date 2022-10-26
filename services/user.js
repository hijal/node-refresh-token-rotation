const User = require("../models").user;

class UserService {
  fetchAll() {
    return User.findAll({});
  }

  findById(id) {
    return User.findOne({
      where: {
        id: id
      }
    });
  }

  update(id, payload) {
    return User.update(payload, {
      where: {
        id: id
      }
    });
  }

  delete(id) {
    return User.destroy({
      where: {
        id: id
      }
    });
  }
}

module.exports = new UserService();
