/*
  Este módulo define un logger personalizado para la aplicación.
*/

import winston from "winston";

// Define niveles personalizados de log y colores asociados
const customLevels = {
  levels: { fatal: 0, error: 1, warning: 2, info: 3, http: 4, debug: 5 },
  colors: {
    fatal: "red",
    error: "red",
    warning: "yellow",
    info: "green",
    http: "cyan",
    debug: "white",
  },
};

// Configura el logger para el entorno de desarrollo
const DevelopmentLogger = winston.createLogger({
  levels: customLevels.levels,
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        // Agrega color a los mensajes de log basado en el nivel de severidad
        winston.format.colorize({ colors: customLevels.colors }),
        winston.format.simple()
      ),
    }),
  ],
});

// Configura el logger para el entorno de producción
const ProductionLogger = winston.createLogger({
  levels: customLevels.levels,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        // Agrega color a los mensajes de log basado en el nivel de severidad
        winston.format.colorize({ colors: customLevels.colors }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "./logs/errors.log",
      level: "error",
      format: winston.format.simple(),
    }),
  ],
});

// Exporta el logger adecuado según el entorno de ejecución
export default process.env.NODE_ENV === "production"
  ? ProductionLogger
  : DevelopmentLogger;
