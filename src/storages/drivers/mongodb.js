import mongoose from "mongoose";

mongoose.Promise = Promise;

export function connect(dataBaseUrl) {
  return mongoose.connect(dataBaseUrl, {
    promiseLibrary: Promise,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
}

export function disconnect() {
  return mongoose.disconnect();
}
