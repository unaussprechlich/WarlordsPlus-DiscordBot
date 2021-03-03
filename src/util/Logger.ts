import * as Winston from "winston"

export default Winston.createLogger({
    format : Winston.format.combine(
        Winston.format.colorize(),
        Winston.format.timestamp(),
        Winston.format.align(),
        Winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports:[
        new Winston.transports.Console()
    ]
});
