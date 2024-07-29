const jwt = require("jsonwebtoken")
const crypto = require("crypto")

function sign_token(user, token_secret, access_time ){
    
    return new Promise((resolve, reject) =>{

        try{
            const token = jwt.sign({ username : user.username }, token_secret, { expiresIn: access_time });

            resolve({
                token
            })
        }
        catch(error){
            reject(error);
        }
    })
}

function verify_token( token, token_secret ){
    return new Promise((resolve, reject) => {
        try{
            const decodedToken = jwt.verify(token, token_secret);
            resolve({
                decodedToken
            })
        }
        catch(error){
            reject(error);
        }
    })
}

function generate_hash( token ){
    return new Promise((resolve, reject) => {
        try{
            const token_hash = crypto.createHash('sha256').update(token).digest('hex');

            resolve({
                token_hash
            });
        }
        catch(error){
            reject(error);
        }
    })
}

module.exports = {
    sign_token,
    verify_token,
    generate_hash
}