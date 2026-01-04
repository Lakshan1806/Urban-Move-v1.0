import { createServer } from "http";

import "./config/env.js";
import { connectDB } from "./config/db.js";
import createApp from "./app.js";
import checkAndCreateAdmin from "./utils/adminInitialSetup.js";
import schedulePromoCleanup from "./utils/schedulePromoCleanup.js";
import { initSocket } from "./utils/socket.js";
import registerSocketHandlers from "./sockets/registerSocketHandlers.js";

const PORT = process.env.PORT || 5000;

if (!process.env.SESSION_SECRET || !process.env.MONGO_URI) {
  console.error("Missing SESSION_SECRET or MONGO_URI in .env file");
  process.exit(1);
}

async function startServer() {
  await connectDB();
  await checkAndCreateAdmin();
  schedulePromoCleanup();

  const app = createApp();
  const httpServer = createServer(app);
  const io = initSocket(httpServer);

  registerSocketHandlers(io);

  httpServer.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
