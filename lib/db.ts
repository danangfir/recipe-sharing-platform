import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

declare global {
  var mongooseCache: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

global.mongooseCache = global.mongooseCache || { conn: null, promise: null };

async function connectDb() {
  if (global.mongooseCache.conn) {
    return global.mongooseCache.conn;
  }

  if (!global.mongooseCache.promise) {
    const opts = {
      bufferCommands: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    global.mongooseCache.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => mongoose.connection);
  }

  try {
    global.mongooseCache.conn = await global.mongooseCache.promise;
  } catch (e) {
    global.mongooseCache.promise = null;
    throw e;
  }

  return global.mongooseCache.conn;
}

export default connectDb;
