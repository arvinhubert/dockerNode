
const winston = require('winston');
const { createLogger, format, transports, loggers } =  winston;


const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'receiver' },
  transports: [
    //
    // - Write to all logs with level `info` and below to `quick-start-combined.log`.
    // - Write all logs error (and below) to `quick-start-error.log`.
    //
    new transports.File({ filename: 'receiver-error.log', level: 'error' }),
    new transports.File({ filename: 'receiver-combined.log' })
  ]
});

module.exports = logger;