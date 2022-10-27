"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate(models) {}
  }
  user.init(
    {
      user_key: DataTypes.STRING,
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      refresh_token: {
        type: DataTypes.JSONB,
        defaultValue: []
      }
    },
    {
      sequelize,
      modelName: "user"
    }
  );
  return user;
};
