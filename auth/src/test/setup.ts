import { MongoMemoryServer } from "mongodb-memory-server";
import { ConnectOptions, connect, connection } from "mongoose";
import { app } from "../app";
import request from "supertest";

declare global {
  function signin(): Promise<string[]>;
}
let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "asdfg";
  mongo = await MongoMemoryServer.create();
  const mongoURI = mongo.getUri();

  await connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions);
});

beforeEach(async () => {
  const collections = await connection.db.collections();

  for (let i of collections) {
    await i.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await connection.close();
});

global.signin = async () => {
  const email = "test@test.com";
  const password = "password";
  const response = await request(app).post("/api/users/signup").send({
    email,
    password,
  });
  const cookie = response.get("Set-Cookie");
  return cookie;
};
