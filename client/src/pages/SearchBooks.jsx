// COMMENT: imports the required modules
import { useState, useEffect } from "react";
import { Container, Col, Form, Button, Card, Row } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import Auth from "../utils/auth";
import { SAVE_BOOK } from "../utils/mutations";
import { saveBookIds, getSavedBookIds } from "../utils/localStorage";

// COMMENT: defines the serachGoogleBooks function to search for books using the Google Books API
const searchGoogleBooks = (query) => {
     return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
};

// COMMENT: defines the SearchBooks component
const SearchBooks = () => {
     const [searchedBooks, setSearchedBooks] = useState([]); // COMMENT: sets the initial state of the searchedBooks
     const [searchInput, setSearchInput] = useState(""); // COMMENT: sets the initial state of the searchInput
     const [savedBookIds, setSavedBookIds] = useState([]); // COMMENT: sets the initial state of the savedBookIds

     // COMMENT: if the user is logged in, get the user's saved books from local storage and set the savedBookIds state, used to load the saved book IDs from local storage when the component mounts
     useEffect(() => {
          if (Auth.loggedIn()) {
               const userId = Auth.getUserId();
               if (userId) {
                    setSavedBookIds(getSavedBookIds(userId));
               }
          }
     }, []);

     // set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
     // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
     useEffect(() => {
          // check if user is logged in
          if (Auth.loggedIn()) {
               const userId = Auth.getUserId();
               if (userId) {
                    saveBookIds(savedBookIds, userId);
               }
          }
     }, [savedBookIds]);

     // COMMENT: sets the useMutation hook to save a book
     const [saveBook] = useMutation(SAVE_BOOK);

     // COMMENT: defines the handleFormSubmit function to handle the form submission
     const handleFormSubmit = async (event) => {
          event.preventDefault();

          if (!searchInput) {
               return false;
          }

          try {
               const response = await searchGoogleBooks(searchInput); // COMMENT: calls the searchGoogleBooks function and passes in the searchInput

               if (!response.ok) {
                    throw new Error("something went wrong!");
               }

               const { items } = await response.json(); // COMMENT: sets the items variable to the response data

               // COMMENT: maps over the items and returns the book data with or without what's required by the database
               const allBookData = items.map((book) => ({
                    bookId: book.id,
                    authors: book.volumeInfo.authors || ["No author to display"],
                    title: book.volumeInfo.title,
                    description: book.volumeInfo.description,
                    image: book.volumeInfo.imageLinks?.thumbnail || "",
               }));

               const bookData = allBookData.filter((book) => book.bookId && book.title && book.description); // COMMENT: filtering out books that don't have a bookId, title, or description which are required for saving to the database

               setSearchedBooks(bookData); // COMMENT: sets the searchedBooks state to the bookData
               setSearchInput(""); // COMMENT: resets the searchInput state
          } catch (err) {
               console.error(err);
          }
     };

     // COMMENT: function to handle saving a book to our database
     const handleSaveBook = async (bookId) => {
          const bookToSave = searchedBooks.find((book) => book.bookId === bookId); // COMMENT: // find the book in `searchedBooks` state by the matching id

          const token = Auth.loggedIn() ? Auth.getToken() : null; // COMMENT:

          if (!token) {
               return false;
          }

          let error;
          try {
               // COMMENT: calls the saveBook mutation and passes in the bookToSave
               const { data } = await saveBook({
                    variables: {
                         bookData: bookToSave,
                    },
               });

               setSavedBookIds((prevSavedBookIds) => [...prevSavedBookIds, bookToSave.bookId]); // COMMENT: if book successfully saves to user's account, save book id to state
          } catch (err) {
               console.error(err);
               error = err;
          }

          if (error) {
               throw new Error("something went wrong!");
          }
     };

     return (
          <>
               <div className="text-light bg-dark p-5">
                    <Container>
                         <h1>Search for Books!</h1>
                         <Form onSubmit={handleFormSubmit}>
                              <Row>
                                   <Col xs={12} md={8}>
                                        <Form.Control
                                             name="searchInput"
                                             value={searchInput}
                                             onChange={(e) => setSearchInput(e.target.value)}
                                             type="text"
                                             size="lg"
                                             placeholder="Search for a book"
                                        />
                                   </Col>
                                   <Col xs={12} md={4}>
                                        <Button type="submit" variant="success" size="lg">
                                             Submit Search
                                        </Button>
                                   </Col>
                              </Row>
                         </Form>
                    </Container>
               </div>

               <Container>
                    <h2 className="pt-5">
                         {searchedBooks.length
                              ? `Viewing ${searchedBooks.length} results:`
                              : "Search for a book to begin"}
                    </h2>
                    <Row>
                         {searchedBooks.map((book) => {
                              return (
                                   <Col md="4" key={book.bookId}>
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
                                                  {Auth.loggedIn() && (
                                                       <Button
                                                            disabled={savedBookIds?.some(
                                                                 (savedBookId) => savedBookId === book.bookId
                                                            )}
                                                            className="btn-block btn-info"
                                                            onClick={() => handleSaveBook(book.bookId)}
                                                       >
                                                            {savedBookIds?.some(
                                                                 (savedBookId) => savedBookId === book.bookId
                                                            )
                                                                 ? "This book has already been saved!"
                                                                 : "Save this Book!"}
                                                       </Button>
                                                  )}
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

// COMMENT: exports the SearchBooks component
export default SearchBooks;
