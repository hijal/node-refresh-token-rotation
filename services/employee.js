const Employee = require("../models").employee;

class EmployeeService {
  fetchAll() {
    return Employee.findAll({});
  }

  create(data) {
    return Employee.create(data);
  }

  findById(id) {
    return Employee.findOne({
      where: {
        id: id
      }
    });
  }

  update(id, payload) {
    return Employee.update(payload, {
      where: {
        id: id
      }
    });
  }

  delete(id) {
    return Employee.destroy({
      where: {
        id: id
      }
    });
  }
}

module.exports = new EmployeeService();
