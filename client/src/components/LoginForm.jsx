// COMMENT: imports thhe required modules
import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../utils/mutations";
import Auth from "../utils/auth";

// COMMENT: defines the LoginForm component
const LoginForm = () => {
     const [userFormData, setUserFormData] = useState({ email: "", password: "" }); // COMMENT: sets the initial state of the form
     const [validated] = useState(false); // COMMENT: sets the initial state of the form validation
     const [showAlert, setShowAlert] = useState(false); // COMMENT: sets the initial state of the alert

     const [login] = useMutation(LOGIN_USER); // COMMENT: sets the useMutation hook to login a user

     // COMMENT: sets the handleInputChange function to update the form state when the user types into the input fields
     const handleInputChange = (event) => {
          const { name, value } = event.target;
          setUserFormData({
               ...userFormData,
               [name]: value,
          });
     };

     // COMMENT: sets the handleFormSubmit function to handle the form submission
     const handleFormSubmit = async (event) => {
          event.preventDefault();

          // check if form has everything (as per react-bootstrap docs)
          const form = event.currentTarget;
          if (form.checkValidity() === false) {
               event.preventDefault();
               event.stopPropagation();
          }

          try {
               // COMMENT: calls the login mutation and passes in the userFormData
               const response = await login({
                    variables: { ...userFormData },
               });
               Auth.login(response.data.login.token); // COMMENT: logs the user in and saves the token to local storage with the Auth.login method
          } catch (err) {
               console.error(err);
               setShowAlert(true);
          }

          // COMMENT: resets the form state
          setUserFormData({
               email: "",
               password: "",
          });
     };

     return (
          <>
               <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
                    <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant="danger">
                         Something went wrong with your login credentials!
                    </Alert>
                    <Form.Group className="mb-3">
                         <Form.Label htmlFor="email">Email</Form.Label>
                         <Form.Control
                              type="text"
                              placeholder="Your email"
                              name="email"
                              onChange={handleInputChange}
                              value={userFormData.email}
                              required
                              autoComplete="email"
                         />
                         <Form.Control.Feedback type="invalid">Email is required!</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                         <Form.Label htmlFor="password">Password</Form.Label>
                         <Form.Control
                              type="password"
                              placeholder="Your password"
                              name="password"
                              onChange={handleInputChange}
                              value={userFormData.password}
                              required
                              autoComplete="current-password"
                         />
                         <Form.Control.Feedback type="invalid">Password is required!</Form.Control.Feedback>
                    </Form.Group>
                    <Button disabled={!(userFormData.email && userFormData.password)} type="submit" variant="success">
                         Submit
                    </Button>
               </Form>
          </>
     );
};

// COMMENT: exports the LoginForm component
export default LoginForm;
