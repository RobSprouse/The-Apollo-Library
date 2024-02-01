// COMMENT: imports the required modules
import { useState, useEffect } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { useMutation, useQuery } from "@apollo/client";
import Auth from "../utils/auth";
import { removeBookId } from "../utils/localStorage";
import { GET_ME } from "../utils/queries";
import { REMOVE_BOOK } from "../utils/mutations";

// COMMENT: defines the SavedBooks component
const SavedBooks = () => {
     const { loading, data, error } = useQuery(GET_ME); // COMMENT: sets the useQuery hook to get the user's data
     const userData = data?.me; // COMMENT: sets the userData variable to the user's data

     const [removeBook, { error: mutationError }] = useMutation(REMOVE_BOOK); // COMMENT: sets the useMutation hook to remove a book

     // COMMENT: defines the handleDeleteBook function to remove a book from the user's saved books
     const handleDeleteBook = async (bookId) => {
          const token = Auth.loggedIn() ? Auth.getToken() : null; // COMMENT: sets the token variable to the user's token

          if (!token) {
               return false;
          }

          try {
               // COMMENT: calls the removeBook mutation and passes in the bookId
               const { data } = await removeBook({
                    variables: { bookId },
               });

               if (!data) {
                    throw new Error("There was an error deleting the book!");
               }

               // COMMENT: removes the bookId from the user's saved books in local storage
               removeBookId(bookId, Auth.getUserId());
          } catch (err) {
               console.error(err);
          }
     };

     // COMMENT: checks if the query is still loading
     if (loading) {
          return <h2>LOADING...</h2>;
     }

     // COMMENT: checks if there was an error with the query
     if (error) {
          return <h2>There was an error loading your books. Please try again. Error Message: {error.message}</h2>;
     }

     // COMMENT: checks if there was an error with the mutation
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

// COMMENT: exports the SavedBooks component
export default SavedBooks;
