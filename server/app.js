const express = require('express');
const { connectToDatabase, Logger }  = require("./config")
const { AuthRouter } = require('./router')
const { LoggerMiddleware, AuthMiddleware } = require("./middleware")

const app = express();
const logger = Logger(__filename)
const SERVER_PORT = process.env.SERVER_PORT || 8000;

connectToDatabase.InitiateMongoServer().then((resolve) => {
    logger.info(resolve);
})
.catch((error)=>{
    logger.fatal(resolve);
})

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(LoggerMiddleware.logger_middleware);

app.use('/auth-route',AuthRouter);

app.get('/protected', AuthMiddleware.auth_middleware, (req, res)=>{
    logger.info(JSON.stringify(req.user));
    res.status(200).json({
        message:"success"
    })
})

app.listen(SERVER_PORT,()=>{
    logger.info(`Listening on PORT :: ${SERVER_PORT}`)
})