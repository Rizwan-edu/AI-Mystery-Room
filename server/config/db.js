import dns from 'dns';
import mongoose from 'mongoose';

// Configure reliable DNS servers to resolve MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch {
  // Use platform default if custom DNS is not permitted
}

let dbStatus = {
  connected: false,
  mode: 'uninitialized',
  host: null,
  error: null,
};

export function getDbStatus() {
  return {
    ...dbStatus,
    connected: mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
  };
}

export async function connectDB() {
  let uri = process.env.MONGODB_URI;
  const isProduction = process.env.NODE_ENV === 'production';

  if (!uri || uri.includes('your_mongodb_connection_string')) {
    const msg = 'MONGODB_URI is not configured in server/.env.';
    dbStatus.error = msg;
    if (isProduction) {
      console.error(`❌ [PRODUCTION FATAL] ${msg} Production requires a valid MongoDB connection string.`);
      throw new Error(msg);
    } else {
      dbStatus.mode = 'in-memory-dev';
      console.warn(`\n⚠️  ${msg}`);
      console.warn(`⚡ [DEVELOPMENT ONLY] Running in temporary IN-MEMORY mode.`);
      console.warn(`💡 Case data will NOT persist across restarts until MongoDB is connected.\n`);
      return;
    }
  }

  // Ensure default database name if none is in URI path
  if (uri.endsWith('/')) {
    uri = `${uri}ai-mystery-room?retryWrites=true&w=majority`;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    dbStatus.connected = true;
    dbStatus.mode = 'mongodb-atlas';
    dbStatus.host = conn.connection.host;
    dbStatus.error = null;
    console.log(`\n✅ [DATABASE] Connected to MongoDB Atlas successfully!`);
    console.log(`📍 Cluster Host: ${conn.connection.host}`);
    console.log(`📂 Database Name: ${conn.connection.name}\n`);
  } catch (error) {
    dbStatus.connected = false;
    dbStatus.error = error.message;

    if (isProduction) {
      console.error(`\n❌ [PRODUCTION FATAL] MongoDB Connection Error: ${error.message}`);
      throw error;
    } else {
      dbStatus.mode = 'in-memory-dev';
      console.error(`\n⚠️  [DATABASE ERROR] MongoDB Connection Failed: ${error.message}`);
      console.warn(`⚡ [DEVELOPMENT FALLBACK] Temporarily active in IN-MEMORY mode.`);
      console.warn(`💡 Investigation cases will function, but will not be saved to Atlas until the connection issue is resolved.\n`);
    }
  }
}

process.on('SIGINT', async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
    console.log('✓ MongoDB connection closed cleanly.');
  }
});
