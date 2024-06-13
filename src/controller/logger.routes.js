/**
 * Este archivo contiene las rutas del registrador para manejar diferentes tipos de errores.
 * Exporta un enrutador Express con las siguientes rutas:
 * - GET /loggerTest/:errorType: Maneja las solicitudes para probar diferentes tipos de errores.
 *   - Parámetros:
 *     - errorType: El tipo de error a probar (fatal, error, warning, info, http, debug).
 *   - Respuesta:
 *     - Si el tipo de error es válido, registra el error utilizando la utilidad Logger y envía una respuesta con el tipo de error recibido.
 *     - Si ocurre un error, registra el error utilizando la utilidad Logger.
 */
/**
 *
 */

import { Router } from "express";
import Logger from "../utils/Logger.js";
const router = Router();

router.get("/loggerTest/:errorType", async (req, res) => {
  try {
    const errorType = req.params.errorType;
    switch (errorType) {
      case "fatal":
        Logger.fatal("fatal");
        break;
      case "error":
        Logger.error("error");
        break;
      case "warning":
        Logger.warning("warning");
        break;
      case "info":
        Logger.info("info");
        break;
      case "http":
        Logger.http("http");
        break;
      case "debug":
        Logger.debug("debug");
        break;
    }
    res.send(`ERROR TYPE: ${errorType} RECIVED`);
  } catch (error) {
    Logger.error(error);
  }
});

export default router;
