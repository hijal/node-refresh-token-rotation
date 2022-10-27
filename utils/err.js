"use strict";

module.exports = function (message, status = 500, errors = []) {
  let err = new Error(message);
  let msg = err.message.toString();

  // composing error
  err.status = status;
  err.errors = errors;
  err.msg = msg;

  return err;
};
