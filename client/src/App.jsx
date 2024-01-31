import "./App.css";
import { Outlet } from "react-router-dom";
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import Navbar from "./components/Navbar";

const httpLink = createHttpLink({
     uri: "/graphql",
});

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

const client = new ApolloClient({
     link: authLink.concat(httpLink),
     cache,
});

function App() {
     return (
          <ApolloProvider client={client}>
               <Navbar />
               <Outlet />
          </ApolloProvider>
     );
}

export default App;
