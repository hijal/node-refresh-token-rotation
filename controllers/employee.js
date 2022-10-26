const employeeService = require("../services/employee");

class EmployeeController {
  fetchAll(req, res) {
    return employeeService.fetchAll();
  }

  findById(req, res) {
    return employeeService.findById(req.params.id);
  }

  create(req, res) {
    return employeeService.create(req.body);
  }

  async update(req, res) {
    await employeeService.update(req.params.id, req.body);
    return "Employee updated successfully";
  }

  async delete(req, res) {
    await employeeService.delete(req.params.id);
    return "Employee deleted successfully";
  }
}

module.exports = new EmployeeController();
