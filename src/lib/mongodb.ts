import { MongoClient } from "mongodb";

declare global {
  var __researchVaultMongoClientPromise__: Promise<MongoClient> | undefined;
}

function getMongoUri() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  return uri;
}

export function getDatabaseName() {
  const databaseName = process.env.MONGODB_DB_NAME;

  if (!databaseName) {
    throw new Error("Missing MONGODB_DB_NAME environment variable.");
  }

  return databaseName;
}

export function getMongoClient() {
  if (!global.__researchVaultMongoClientPromise__) {
    const client = new MongoClient(getMongoUri());
    global.__researchVaultMongoClientPromise__ = client.connect();
  }

  return global.__researchVaultMongoClientPromise__;
}

export async function getDatabase() {
  const client = await getMongoClient();
  return client.db(getDatabaseName());
}
