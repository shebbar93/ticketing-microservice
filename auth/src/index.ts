import { ConnectOptions, connect } from "mongoose";
import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  try {
    await connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    console.log("Connected to auth mongo DB");
  } catch (ex) {
    console.error(ex);
  }
  app.listen(3000, () => {
    console.log("Listening on port 3000...");
  });
};

start();
