
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// creating user schema
const userSchema = new mongoose.Schema({
    // user's name
    name:{
        type:String,
        // required true, if user's not give name then show message
        require:[true, 'Please enter your name'],
        // max length of name
        maxlength:[40, 'Name cannot be greater than 40 Characters']
    },
    // email address of user
    email:{
        tyep:String,
        require:[true,'Please enter your email'],
        // make email unique for each user
        unique:true,
        // validate whether email entered is in correct format
        validate:[validator.isEmail , 'Please enter valid email address']
    },
    // password
    password:{
        type:String,
        required:[true, 'Please enter password'],
        // min length of password
        minLength:[8, 'password cannot be less than 8 characters'],
        // will not return password value when getting user's data from database
        select:false
    },
    role:{
        // role of user
        type:String,
        // by default user is set to 'user'
        default:'user'
    },
    photo:{
        // user's photo
        // photo id in cloudinary
        id:{
            type:String,
            require:true
        },
        // url from cloudinary
        secure_url:{
            type:String,
            require:true,
        }
        
    },
    // token for forget password
    forgetPasswordToken:String,
    // expiry time of forgetpass token
    forgetPasswordExpiry:Date,
    // user created at 
    createdAt:{
        type:Date,
        default:Date.now

    }
});



userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    } // Adding this statement solved the problem!!

    this.password = await bcrypt.hash(this.password,10);
});

userSchema.methods.isPasswordMatch = async function(enteredPassword){
    return bcrypt.compare(enteredPassword,this.password);
}


userSchema.methods.getCreateJWTToken = function(){
    // generating a new token for the user
    return jwt.sign(
        {id: this._id},
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: process.env.JWT_EXPIRY
        }
    );
}

// exporting the schema's model
module.exports = mongoose.model('User',userSchema);