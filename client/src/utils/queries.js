// COMMENT: imports the gql tagged template literal
import { gql } from "@apollo/client";

// COMMENT: exports the GET_ME query
export const GET_ME = gql`
     query me {
          me {
               _id
               username
               email
               bookCount
               savedBooks {
                    bookId
                    title
                    authors
                    description
                    image
                    link
               }
          }
     }
`;
