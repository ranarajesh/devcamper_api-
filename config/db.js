const mongoose = require("mongoose");

const connectDb = async () => {
  const dbConn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log(
    `MongoDB connect to ${dbConn.connection.host}`.cyan.underline.bold
  );
};

module.exports = connectDb;
