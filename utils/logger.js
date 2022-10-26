"use strict";

// core dependencies
const { AsyncLocalStorage } = require("async_hooks");

// npm dependencies
const winston = require("winston");

module.exports = function () {
  const als = new AsyncLocalStorage();

  const logger = new winston.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
          winston.format.printf((info) => {
            let uid = als.getStore();
            return `${info.timestamp} ${uid ? "[" + uid + "] " : ""}` + `[${info.level}] ${info.message}`;
          })
        )
      })
    ],

    levels: { error: 0, warn: 1, info: 2 }
  });

  // add async local storage
  logger.als = als;

  return logger;
};
