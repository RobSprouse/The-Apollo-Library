// COMMENT: imports the Schema constructor and model function from the mongoose library and the bcrypt library
const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

// import schema from Book.js
const bookSchema = require("./Book");

// COMMENT: creates the User schema
const userSchema = new Schema(
     {
          username: {
               type: String,
               required: true,
               unique: true,
          },
          email: {
               type: String,
               required: true,
               unique: true,
               match: [/.+@.+\..+/, "Must use a valid email address"],
          },
          password: {
               type: String,
               required: true,
          },
          // set savedBooks to be an array of data that adheres to the bookSchema
          savedBooks: [bookSchema],
     },
     // set this to use virtual below
     {
          toJSON: {
               virtuals: true,
          },
     }
);

// hash user password
userSchema.pre("save", async function (next) {
     if (this.isNew || this.isModified("password")) {
          const saltRounds = 10;
          this.password = await bcrypt.hash(this.password, saltRounds);
     }

     next();
});

// custom method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password) {
     return bcrypt.compare(password, this.password);
};

// when we query a user, we'll also get another field called `bookCount` with the number of saved books we have
userSchema.virtual("bookCount").get(function () {
     return this.savedBooks.length;
});

// COMMENT: creates the User model using the User schema
const User = model("User", userSchema);

// COMMENT: exports the User model
module.exports = User;
