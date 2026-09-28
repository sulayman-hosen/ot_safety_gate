import mongoose from 'mongoose';

mongoose.set('bufferCommands', false);
let connectionPromise;

export async function connectDatabase() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ot_safety_gate',
      { serverSelectionTimeoutMS: 5000, autoIndex: true }
    ).then(async () => {
      // Mongoose 9 + Atlas SRV: ensure the driver's db handle is resolved
      // before models call createCollection via init().
      await mongoose.connection.asPromise();
      return mongoose.connection;
    }).catch(error => {
      connectionPromise = undefined;
      throw error;
    });
  }
  return connectionPromise;
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
  connectionPromise = undefined;
}
