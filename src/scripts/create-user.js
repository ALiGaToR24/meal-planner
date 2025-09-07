// Запуск: node scripts/create-user.js email@example.com "SuperSecret"
const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");

(async () => {
  const [,, email, password] = process.argv;
  if (!email || !password) {
    console.error("Usage: node scripts/create-user.js <email> <password>");
    process.exit(1);
  }
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI missing in env");

  const client = new MongoClient(uri);
  await client.connect();
  const dbo = client.db();
  const users = dbo.collection("users");

  const existing = await users.findOne({ email });
  if (existing) {
    console.log("User already exists:", email);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await users.insertOne({ email, passwordHash, createdAt: new Date() });
  console.log("User created:", email);
  await client.close();
})();
