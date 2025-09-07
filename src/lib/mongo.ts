import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
if (!uri) throw new Error("MONGODB_URI is missing");

const dbNameFromEnv = process.env.MONGODB_DB; // можно не задавать, если есть в URI

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global { var _mongoClientPromise: Promise<MongoClient> | undefined; }

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise!;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function db() {
  const cli = await clientPromise;
  // если имя БД указано отдельно — используем его, иначе возьмётся из URI
  return dbNameFromEnv ? cli.db(dbNameFromEnv) : cli.db();
}
