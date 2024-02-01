// COMMENT: imports the required modules
import "./App.css";
import { Outlet } from "react-router-dom";
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import Navbar from "./components/Navbar";

// COMMENT: defines the httpLink variable to create a new HttpLink
const httpLink = createHttpLink({
     uri: "/graphql",
});

// COMMENT: defines the authLink variable to create a new setContext
const authLink = setContext((_, { headers }) => {
     // get the authentication token from local storage if it exists
     const token = localStorage.getItem("id_token");
     // return the headers to the context so httpLink can read them
     return {
          headers: {
               ...headers,
               authorization: token ? `Bearer ${token}` : "",
          },
     };
});

// COMMENT: defines the cache variable to create a new InMemoryCache that merges the savedBooks field of the User type
const cache = new InMemoryCache({
     typePolicies: {
          User: {
               fields: {
                    savedBooks: {
                         merge(existing, incoming) {
                              return incoming;
                         },
                    },
               },
          },
     },
});

// COMMENT: defines the client variable to create a new ApolloClient
const client = new ApolloClient({
     link: authLink.concat(httpLink),
     cache,
});

// COMMENT: defines the App function
function App() {
     return (
          <ApolloProvider client={client}>
               <Navbar />
               <Outlet />
          </ApolloProvider>
     );
}

// COMMENT: exports the App function
export default App;
