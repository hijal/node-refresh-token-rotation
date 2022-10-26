function wrapper(fn) {
    return async function (req, res, next) {
      try {
        res.json(await fn(req, res, next));
      } catch (err) {
        next(err);
      }
    };
  }
  
  module.exports = wrapper;