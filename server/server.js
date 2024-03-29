// COMMENT: imports the required modules
const express = require("express");
const path = require("path");
const db = require("./config/connection");
const { ApolloServer } = require("apollo-server-express");
const { authMiddleware } = require("./utils/auth");
const { typeDefs, resolvers } = require("./schemas");

// COMMENT: creates a new express server
const app = express();
// COMMENT: sets the port for the server
const PORT = process.env.PORT || 3001;
// Create a new instance of an Apollo server with the GraphQL schema
const server = new ApolloServer({
     typeDefs,
     resolvers,
     context: ({ req }) => {
          // pass the request object to the authMiddleware function
          const authUser = authMiddleware({ req });
          // return the user in the context
          return { user: authUser.user };
     },
});

// COMMENT: sets up the middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
     app.use(express.static(path.join(__dirname, "../client/dist")));
}

app.get("*", (req, res) => {
     res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
     await server.start();
     server.applyMiddleware({ app });

     db.once("open", () => {
          app.listen(PORT, () => {
               console.log(`Server running on port ${PORT}!`);
               console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
          });
     });
};

// Call the async function to start the server
startApolloServer(typeDefs, resolvers);
