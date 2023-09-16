// following function is equivalent to try catch
// can use either of the two (try-catch / bigPromise)


// take a function as argument
module.exports = (func) => (req, res, next) =>
  Promise.resolve(func(req, res, next)).catch(next);