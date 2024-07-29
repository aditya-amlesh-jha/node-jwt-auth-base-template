class AuthException extends Error{
    constructor(message){
        super(message);
        this.name = "AuthException";
    }
}

class InvalidInputError extends AuthException{
    constructor(message){
        super(message);
        this.name = "InvalidInputError";
    }
}

class InvalidCredentialError extends AuthException{
    constructor(message){
        super(message);
        this.name = "InvalidCredentialError";
    }
}

class InvalidTokenError extends AuthException{
    constructor(message){
        super(message);
        this.name = "NoAccessTokenError";
    }
}

module.exports = {
    InvalidInputError,
    InvalidCredentialError,
    InvalidTokenError
}