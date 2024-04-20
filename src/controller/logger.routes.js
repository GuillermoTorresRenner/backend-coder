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

      default:
        break;
    }
  } catch (error) {
    if (error instanceof InsufficientDataError) {
      res.status(error.getErrorData).send(error.getErrorData());
    } else {
      res.status(500).send(error.message);
    }
  }
});

export default router;
