const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { Logger } = require("../config");

const { UserClient } = require("../model")
const { UserClass } = require("../classes")
const { TokenHelper } = require("../helper")
const { AuthException } = require("../exception")

const logger = Logger(__filename);

async function signup(req, res){
    try{
        let { firstName, lastName, username, email, password, role="user" } = req.body.user;

        const person = new UserClass.User(
            firstName = firstName,
            lastName = lastName,
            username = username,
            email = email,
            password = password,
            role = role
        )

        if( person.checkNullAttributes() ){
            throw new AuthException.InvalidInputError("Incomplete details provided")
        }

        const savedUser = await UserClient.signup( person );

        res.status(StatusCodes.OK).json({
            message: ReasonPhrases.OK
        });
    }
    catch(error){
        
        logger.info(error)

        let status = 500;

        if(error instanceof AuthException.InvalidCredentialError || error instanceof AuthException.InvalidInputError){
            status = 400
        }

        res.status(status).json({
            error:error.message
        })
    }
}

async function login(req, res){
    try{
        const { username, email, password } = req.body;
        let user;

        if(!username && !email){
            throw new AuthException.InvalidInputError("Please enter username/email");
        }
        else if( username ){
            user = await UserClient.loginByUsername(username, password);
        }
        else{
            user = await UserClient.loginByEmail(email, password);
        }
        
        if(!user){
            throw new AuthException.InvalidCredentialError("Wrong credentials!");
        }

        const { token: accessToken } = await TokenHelper.sign_token(user, process.env.ACCESS_SECRET, process.env.ACCESS_TOKEN_DEFAULT_TIME);
        const { token: refreshToken }  = await TokenHelper.sign_token(user, process.env.REFRESH_SECRET, process.env.REFRESH_TOKEN_DEFAULT_TIME);
        const { token_hash: refreshTokenHash }= await TokenHelper.generate_hash(refreshToken);

        user.refeshTokenHash = refreshTokenHash;
        await user.save();

        res.status(StatusCodes.OK).json({
            message: ReasonPhrases.OK,
            token: accessToken
        });

    }
    catch(error){

        logger.info(error)

        let status = 500;

        if(error instanceof AuthException.InvalidCredentialError || error instanceof AuthException.InvalidInputError){
            status = 400
        }

        res.status(status).json({
            error:error.message
        });
    }
    
    
    
}

async function refresh_token(req, res){
    try{
        const refreshToken = req.body.refreshToken;

        if( !refreshToken ){
            throw new AuthException.InvalidTokenError("No Refresh Token Provided")
        }
        
        const { token_hash: refreshTokenHash } = await TokenHelper.generate_hash(refreshToken);

        const user = await UserClient.findOne({refeshTokenHash: refreshTokenHash});

        if ( !user ){
            throw new AuthException.InvalidTokenError("Invalid Refresh Token Provided")
        }
        
        const {  token: newAccessToken} = await TokenHelper.sign_token(user, process.env.ACCESS_SECRET, process.env.ACCESS_TOKEN_DEFAULT_TIME);

        res.status(200).send({
            accessToken: newAccessToken
        })
    }
    catch(error){
        logger.info(error)

        let status = 500;

        if(error instanceof AuthException.InvalidCredentialError || error instanceof AuthException.InvalidInputError){
            status = 400
        }

        res.status(status).json({
            error:error.message
        });
    }
}


module.exports = {
    login,
    signup,
    refresh_token
}