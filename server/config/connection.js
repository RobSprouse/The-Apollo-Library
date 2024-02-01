// COMMENT: imports mongoose
const mongoose = require("mongoose");

// COMMENT: sets up the connection to the database
mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/googlebooks");

// COMMENT: exports the connection
module.exports = mongoose.connection;
