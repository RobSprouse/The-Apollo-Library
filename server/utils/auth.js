// COMMENT: imports the required modules
const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");

// set token secret and expiration date
const secret = "mysecretsshhhhh";
const expiration = "2h";

// COMMENT: exports the auth functions
module.exports = {
     AuthenticationError: new GraphQLError("Could not authenticate user.", {
          extensions: {
               code: "UNAUTHENTICATED",
          },
     }),
     // function for our authenticated routes
     authMiddleware: function ({ req }) {
          // allows token to be sent via  req.query or headers
          let token = req.body.token || req.query.token || req.headers.authorization;

          // ["Bearer", "<tokenvalue>"]
          if (req.headers.authorization) {
               token = token.split(" ").pop().trim();
          }

          if (!token) {
               return req;
          }

          try {
               // verify token and get user data out of it
               const { data } = jwt.verify(token, secret, { maxAge: expiration });
               req.user = data;
          } catch {
               console.log("Invalid token");
          }

          // return the request object
          return req;
     },
     signToken: function ({ username, email, _id }) {
          const payload = { username, email, _id };

          return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
     },
};
