const { UserClient } = require("../model")
const { TokenHelper } = require("../helper")
const { Logger } = require("../config")

const logger = Logger(__filename);
const tokenSecret = process.env.ACCESS_SECRET;

const auth_middleware = async function(req, res, next){
    try{
        const accessToken = req.body.accessToken; //testing purpose only
        // const { accessToken } = req.headers.Authorization -- use this in live 
        const { decodedToken } = await TokenHelper.verify_token(accessToken, tokenSecret);
        req.user = decodedToken;
        next();
    }
    catch(error){
        logger.info(error);
    }
}

module.exports = {
    auth_middleware
}