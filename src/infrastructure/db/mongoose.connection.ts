import mongoose from "mongoose";

interface MongooseConnection {
  conn?: mongoose.Connection;
  promise?: Promise<mongoose.Connection> | null;
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let connectionCache: MongooseConnection = {};

export default async function dbConnect(): Promise<mongoose.Connection> {
  if (connectionCache.conn) {
    return connectionCache.conn;
  }

  if (!connectionCache.promise) {
    connectionCache.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose.connection;
    });
  }

  try {
    connectionCache.conn = await connectionCache.promise;
  } catch (error) {
    connectionCache.promise = null;
    throw error;
  }

  return connectionCache.conn;
}
