const mongoose = require('mongoose')

const connectDB = async() => {
  const conn = mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });

  console.log(`MongoDB Connected: ${(await conn).connection.host}`.cyan.underline.bold)
}

module.exports = connectDB;
