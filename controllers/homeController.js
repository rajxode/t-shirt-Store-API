const BigPromise = require('../middlewares/bigPromise');

module.exports.home = BigPromise((req,res) => {
    res.send('Hello')
});