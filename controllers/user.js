const userService = require("../services/user");

class UserController {
  fetchAll(req, res) {
    return userService.fetchAll();
  }

  findById(req, res) {
    return userService.findById(req.params.id);
  }

  async update(req, res) {
    await userService.update(req.params.id, req.body);
    return "User updated successfully";
  }

  async delete(req, res) {
    await userService.delete(req.params.id);
    return "User deleted successfully";
  }
}

module.exports = new UserController();
