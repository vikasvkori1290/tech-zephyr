import { app } from './app.js';
import { connectDB } from './config/db.js';
import { ENV } from './config/env.js';

const startServer = async () => {
  try {
    // Attempt database connection
    await connectDB();

    app.listen(ENV.PORT, () => {
      console.log(`🚀 [Server] Running on http://localhost:${ENV.PORT}`);
      console.log(`📡 [API Base] http://localhost:${ENV.PORT}/api/v1`);
      console.log(`🩺 [Health Check] http://localhost:${ENV.PORT}/api/v1/health`);
    });
  } catch (error) {
    console.error(`❌ [Server] Failed to start: ${error.message}`);
    process.exit(1);
  }
};

startServer();
