import { MongoMemoryServer } from "mongodb-memory-server";
import { ConnectOptions, connect, connection, Types } from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  function signin(): string[];
}

jest.mock("../nats-wrapper");

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
  jest.clearAllMocks();
  const collections = await connection.db.collections();

  for (let i of collections) {
    await i.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await connection.close();
});

global.signin = () => {
  //Build a payload
  //Create a JWT
  //Build session object
  //Turn that session into JSON
  //Take JSON and encode it to base64

  const payload = {
    id: new Types.ObjectId().toHexString(),
    email: "test@test.com",
  };
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  const session = { jwt: token };

  const sessionJSON = JSON.stringify(session);

  const base64 = Buffer.from(sessionJSON).toString("base64");
  return [`express:sess=${base64}`];
};
