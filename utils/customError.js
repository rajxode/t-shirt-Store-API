
// for creating custom error message
class CustomError extends Error {
    // get the value of message and status code as parameters
    constructor(message, code) {
        super(message)
        // store code
        this.code = code
    }
}

// export class
module.exports = CustomError
