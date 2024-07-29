const mongoose = require('mongoose');
const bcrypt = require("bcrypt")

const { AuthException } = require("../exception")

const userSchemName = process.env.USER_SCHEMA_NAME;
const saltRound = parseInt(process.env.SALT_ROUND);

const UserSchema = mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
        required: true
    },
    refeshTokenHash: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

UserSchema.statics.signup = async function( person ){

    const userByEmail = await this.findOne({email: person.email});
    const userByUsername = await this.findOne({username: person.username});

    if(userByEmail || userByUsername){
        throw new AuthException.InvalidCredentialError("User already exist by this email/username");
    }
    
    const { password } = person;
    // generate salt and hast the password
    const salt = await bcrypt.genSalt(saltRound);
    const hash = await bcrypt.hash(password,salt);

    person.password = hash

    const user = await this.create(person);

    return user;
}

UserSchema.statics.loginByEmail = async function(email, password){
    const user = await this.findOne({email});

    if (!user){
        throw new AuthException.InvalidCredentialError("No User By the Credentials!");
    }

    const match = await bcrypt.compare(password,user.password);

    if(!match){
        throw new AuthException.InvalidCredentialError("Incorrect password");
    }

    return user;
}

UserSchema.statics.loginByUsername = async function(username, password){
    const user = await this.findOne({username});

    if (!user){
        throw new AuthException.InvalidCredentialError("No User By the Credentials!");
    }

    const match = await bcrypt.compare(password,user.password);

    if(!match){
        throw new AuthException.InvalidCredentialError("Incorrect password");
    }

    return user;
}

const userClient = mongoose.model(userSchemName, UserSchema);

module.exports = userClient;