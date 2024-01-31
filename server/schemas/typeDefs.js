const typeDefs = `
type Book {
     _id: ID!
     bookId: String!
     title: String!
     authors: [String]
     description: String!
     image: String
     link: String
}

type User {
     _id: ID!
     username: String!
     email: String!
     bookCount: Int!
     savedBooks: [Book]
}

type Query {
     me: User
   }

type Auth {
     token: ID!
     user: User
}

input BookInput {
     bookId: String!
     title: String!
     authors: [String]
     description: String!
     image: String
     link: String
}

type Mutation {
     addUser(username: String!, email: String!, password: String!): Auth
     login(username: String, email: String, password: String!): Auth
     saveBook(bookData: BookInput!): User
     removeBook(bookId: String!): User
}
`;

module.exports = typeDefs;
