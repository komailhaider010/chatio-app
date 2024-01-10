const mongoose = require("mongoose");

const dataBaseConnection = async () => {
  MONGO_URI = process.env.MONGO_URI;
  try {
    const conn = mongoose.connect(MONGO_URI, {
      // useNewURLParser: true,
      // useUnifiedTopology:true
      // useCreateIndex:true
    });

    console.log(`Mongodb is connected`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit();
  }
};

module.exports = dataBaseConnection;
