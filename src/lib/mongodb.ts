// mongodb.ts
import { MongoClient, MongoClientOptions } from 'mongodb';

// Extend the MongoClientOptions interface to include useUnifiedTopology
interface CustomMongoClientOptions extends MongoClientOptions {
  useUnifiedTopology?: boolean;
}

declare const global: {
    _mongoClientPromise?: Promise<MongoClient>;
};

  
const uri: string = process.env.MONGODB_URI!;
const options: CustomMongoClientOptions = {
  useUnifiedTopology: true,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error('Add Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
