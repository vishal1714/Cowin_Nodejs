const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./Config.env" });

const ConnectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
    });
    const host = mongoose.connection.host;
    console.log("MongoDB Connected :" + host);
  } catch (err) {
    console.log("MongoDB Connection Failed :" + err);
    process.exit(1);
  }
};

module.exports = ConnectDB;
