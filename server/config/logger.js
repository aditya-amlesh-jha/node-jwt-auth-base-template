const { createLogger, format, transports, config } = require('winston');
const { combine, timestamp, label, printf } = format;

const logFileName = "'combined.log'"

const customFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} : ${level}:  ${label}: :${message}`;
});

// logger.info('This is an info message');
// logger.warn('This is a warning message');
// logger.error('This is an error message');

function Logger(filename) {
    return createLogger({
        format: combine(
            label({ label: filename }),
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            customFormat
        ),
        transports: [
            new transports.Console(),
            new transports.File({ filename: logFileName })
        ]
    });
}

module.exports = Logger;