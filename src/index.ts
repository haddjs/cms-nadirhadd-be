import "dotenv/config";
import "./config/db";
import logger from "./config/logger";
import app from "./server";

app.listen(3000, () => {
  logger.info("server is running on port 3000");
});
