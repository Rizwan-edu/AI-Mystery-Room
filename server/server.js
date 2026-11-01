import dns from 'dns';

// Configure resilient DNS resolution at the earliest entrypoint
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch {
  // Use system default if custom DNS is prohibited by environment
}

import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = parseInt(process.env.PORT, 10) || 5000;
const HOST = '0.0.0.0';

async function startServer() {
  // Connect to database before accepting incoming HTTP requests
  await connectDB();

  const server = app.listen(PORT, HOST, () => {
    console.log(`\n======================================================`);
    console.log(`🕵️‍♂️ AI Mystery Room Server running on http://localhost:${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
    console.log(`======================================================\n`);
  });

  // Handle port binding errors gracefully
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`\n❌ [PORT CONFLICT] Port ${PORT} is already occupied by another process.`);
      console.error(`💡 Automated Diagnostics:`);
      console.error(`   • Run "npm run check-port" in the server directory to see active PID.`);
      console.error(`   • Run "npm run kill-port" to terminate the lingering process.`);
      console.error(`   • Or set PORT=5001 in server/.env to use an alternative port.\n`);
      process.exit(1);
    } else {
      console.error(`❌ Server startup error: ${error.message}`);
      process.exit(1);
    }
  });

  // Graceful shutdown handlers to ensure port is freed immediately on exit
  const shutdown = async (signal) => {
    console.log(`\n🛑 Received ${signal}. Gracefully closing AI Mystery Room server...`);
    server.close(() => {
      console.log('✓ HTTP server closed. Port released.');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  return server;
}

startServer();
