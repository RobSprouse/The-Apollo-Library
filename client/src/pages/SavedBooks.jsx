import { useState, useEffect } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { useMutation, useQuery } from "@apollo/client";

//import { getMe, deleteBook } from "../utils/API"; // COMMENT: removed for refactoring to use the useMutation hook and the queries

import Auth from "../utils/auth";
import { removeBookId } from "../utils/localStorage";
import { GET_ME } from "../utils/queries";
import { REMOVE_BOOK } from "../utils/mutations";

const SavedBooks = () => {

     const { loading, data, error } = useQuery(GET_ME);
     const userData = data?.me;

     const [removeBook, { error: mutationError }] = useMutation(REMOVE_BOOK);

     // create function that accepts the book's mongo _id value as param and deletes the book from the database
     const handleDeleteBook = async (bookId) => {
          const token = Auth.loggedIn() ? Auth.getToken() : null;

          if (!token) {
               return false;
          }

          try {
               const { data } = await removeBook({
                    variables: { bookId },
                    context: {
                         headers: {
                              authorization: `Bearer ${token}`,
                         },
                    },
               });

               if (!data) {
                    throw new Error("There was an error deleting the book!");
               }

               // upon success, remove book's id from localStorage
               removeBookId(bookId);
          } catch (err) {
               console.error(err);
          }
     };

     // Check if the query is loading
     if (loading) {
          return <h2>LOADING...</h2>;
     }

     // Check if there was an error with the query
     if (error) {
          return <h2>There was an error loading your books. Please try again. Error Message: {error.message}</h2>;
     }

     // Check if there was an error with the mutation
     if (mutationError) {
          return <h2>There was an error deleting a book. Please try again. Error Message: {mutationError.message}</h2>;
     }

     return (
          <>
               <Container fluid className="text-light bg-dark p-5">
                    <Container>
                         <h1>Viewing saved books!</h1>
                    </Container>
               </Container>
               <Container>
                    <h2 className="pt-5">
                         {userData.savedBooks.length
                              ? `Viewing ${userData.savedBooks.length} saved ${
                                     userData.savedBooks.length === 1 ? "book" : "books"
                                }:`
                              : "You have no saved books!"}
                    </h2>
                    <Row>
                         {userData.savedBooks.map((book) => {
                              return (
                                   <Col md={4} key={book.bookId}>
                                        <Card border="dark">
                                             {book.image ? (
                                                  <Card.Img
                                                       src={book.image}
                                                       alt={`The cover for ${book.title}`}
                                                       variant="top"
                                                  />
                                             ) : null}
                                             <Card.Body>
                                                  <Card.Title>{book.title}</Card.Title>
                                                  <p className="small">Authors: {book.authors}</p>
                                                  <Card.Text>{book.description}</Card.Text>
                                                  <Button
                                                       className="btn-block btn-danger"
                                                       onClick={() => handleDeleteBook(book.bookId)}
                                                  >
                                                       Delete this Book!
                                                  </Button>
                                             </Card.Body>
                                        </Card>
                                   </Col>
                              );
                         })}
                    </Row>
               </Container>
          </>
     );
};

export default SavedBooks;
