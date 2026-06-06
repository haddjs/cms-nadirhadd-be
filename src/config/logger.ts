import winston from "winston";

const { combine, timestamp, label, printf } = winston.format;

const formatter = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} ${label} [${level}]: ${message}`;
});

const logger = winston.createLogger({
  level: "info",
  format: combine(label({ label: "cms-backend" }), timestamp(), formatter),
  defaultMeta: { service: "cms-backend" },
  transports: [
    new winston.transports.Console({
      format: combine(winston.format.colorize(), formatter),
    }),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

export default logger;
