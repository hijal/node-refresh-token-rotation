"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class employee extends Model {
    static associate(models) {
      // define association here
    }
  }
  employee.init(
    {
      fullname: DataTypes.STRING,
      dept: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "employee"
    }
  );
  return employee;
};
