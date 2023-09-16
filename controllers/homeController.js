
// bigPromise for functions
const BigPromise = require('../middlewares/bigPromise');

// render greeting message on homepage
module.exports.home = BigPromise((req,res,next) => {
    res.send('Hello, Greetings from T-shirt API');
});