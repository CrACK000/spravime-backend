import mongoose, { Mongoose, ConnectOptions } from 'mongoose';

let _client: Mongoose | undefined;

export async function connectToDb() {
  const url = process.env.DB_URL;
  _client = await mongoose.connect(url, {
    dbName: process.env.DB_NAME,
  } as ConnectOptions)
}

export function getDb() {
  if (!_client) {
    throw new Error('You must connect to the DB first');
  }

  return _client.connection.db;
}

export function closeDb() {
  if (!_client) {
    throw new Error('You must connect to the DB first');
  }

  return _client.disconnect();
}