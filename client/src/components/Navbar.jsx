// COMMENT: imports the required modules and components
import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Modal, Tab } from "react-bootstrap";
import SignUpForm from "./SignupForm";
import LoginForm from "./LoginForm";
import Auth from "../utils/auth";

// COMMENT: defines the AppNavbar component which contains the navigation bar and modal for login/signup
const AppNavbar = () => {
     const [showModal, setShowModal] = useState(false); // COMMENT: sets the initial state of the modal to false

     return (
          <>
               <Navbar bg="dark" variant="dark" expand="lg">
                    <Container fluid>
                         <Navbar.Brand as={Link} to="/">
                              Google Books Search
                         </Navbar.Brand>
                         <Navbar.Toggle aria-controls="navbar" />
                         <Navbar.Collapse id="navbar">
                              <Nav className="ms-auto text-end">
                                   <Nav.Link as={Link} to="/">
                                        Search For Books
                                   </Nav.Link>
                                   {/* if user is logged in show saved books and logout */}
                                   {Auth.loggedIn() ? (
                                        <>
                                             <Nav.Link as={Link} to="/saved">
                                                  See Your Books
                                             </Nav.Link>
                                             <Nav.Link onClick={Auth.logout}>Logout</Nav.Link>
                                        </>
                                   ) : (
                                        <Nav.Link onClick={() => setShowModal(true)}>Login/Sign Up</Nav.Link>
                                   )}
                              </Nav>
                         </Navbar.Collapse>
                    </Container>
               </Navbar>
               {/* set modal data up */}
               <Modal size="lg" show={showModal} onHide={() => setShowModal(false)} aria-labelledby="signup-modal">
                    {/* tab container to do either signup or login component */}
                    <Tab.Container defaultActiveKey="login">
                         <Modal.Header closeButton>
                              <Modal.Title id="signup-modal">
                                   <Nav variant="pills">
                                        <Nav.Item>
                                             <Nav.Link eventKey="login">Login</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                             <Nav.Link eventKey="signup">Sign Up</Nav.Link>
                                        </Nav.Item>
                                   </Nav>
                              </Modal.Title>
                         </Modal.Header>
                         <Modal.Body>
                              <Tab.Content>
                                   <Tab.Pane eventKey="login">
                                        <LoginForm handleModalClose={() => setShowModal(false)} />
                                   </Tab.Pane>
                                   <Tab.Pane eventKey="signup">
                                        <SignUpForm handleModalClose={() => setShowModal(false)} />
                                   </Tab.Pane>
                              </Tab.Content>
                         </Modal.Body>
                    </Tab.Container>
               </Modal>
          </>
     );
};

// COMMENT: exports the AppNavbar component
export default AppNavbar;
