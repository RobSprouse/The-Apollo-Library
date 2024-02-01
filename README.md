# The-Apollo-Library

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This repository was created as a part of the University of Richmond's Bootcamp, Module 21 Challenge. This challenge was to start with a fully functioning Google Books API search engine built with a RESTful API, and refactor it to be a GraphQL API built with Apollo Server.

The following User Story and Acceptance Criteria were provided for this challenge:

> ## User Story
>
> ```md
> AS AN avid reader
> I WANT to search for new books to read
> SO THAT I can keep a list of books to purchase
> ```
>
> ## Acceptance Criteria
>
> ```md
> GIVEN a book search engine
> WHEN I load the search engine
> THEN I am presented with a menu with the options Search for Books and Login/Signup and an input field to search for books and a submit button
> HEN I click on the Search for Books menu option
> THEN I am presented with an input field to search for books and a submit button
> WHEN I am not logged in and enter a search term in the input field and click the submit button
> THEN I am presented with several search results, each featuring a book’s title, author, description, image, and a link to that book on the Google Books site
> WHEN I click on the Login/Signup menu option
> THEN a modal appears on the screen with a toggle between the option to log in or sign up
> WHEN the toggle is set to Signup
> THEN I am presented with three inputs for a username, an email address, and a password, and a signup button
> WHEN the toggle is set to Login
> THEN I am presented with two inputs for an email address and a password and login button
> WHEN I enter a valid email address and create a password and click on the signup button
> THEN my user account is created and I am logged in to the site
> WHEN I enter my account’s email address and password and click on the login button
> THEN I the modal closes and I am logged in to the site
> WHEN I am logged in to the site
> THEN the menu options change to Search for Books, an option to see my saved books, and Logout
> WHEN I am logged in and enter a search term in the input field and click the submit button
> THEN I am presented with several search results, each featuring a book’s title, author, description, image, and a link to that book on the Google Books site and a button to save a book to my account
> WHEN I click on the Save button on a book
> THEN that book’s information is saved to my account
> WHEN I click on the option to see my saved books
> THEN I am presented with all of the books I have saved to my account, each featuring the book’s title, author, description, image, and a link to that book on the Google Books site and a button to remove a book from my account
> WHEN I click on the Remove button on a book
> THEN that book is deleted from my saved books list
> WHEN I click on the Logout button
> THEN I am logged out of the site and presented with a menu with the options Search for Books and Login/Signup and an input field to search for books and a submit button
> ```

## Table of Contents

-    [Installation](#installation)
-    [Usage](#usage)
-    [License](#license)
-    [Contributing](#contributing)
-    [Tests](#tests)
-    [Questions](#questions)

## Installation

This application has been deployed to a live site and does't require installation. The application is deployed to Heroku at the following URL: https://the-apollo-library-d861055d734f.herokuapp.com/

If you would like to see this application in its development environment, please follow the instructions below.

This application requires Node.js to run. Please visit https://nodejs.org/en/ to download Node.js if it is not already installed on your computer.

If you are unfamiliar with cloning a repository, please click on the following link to learn: [Github docs | Cloning a repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)

To install this application locally, clone the repository, navigate to its directory in the terminal, and run `npm install` in the command line to install the required dependencies.

The following scripts are available to run in the command line from the root directory of the project:

```json
{
     "name": "the-apollo-library",
     "version": "1.0.0",
     "description": "",
     "main": "server/server.js",
     "scripts": {
          "start": "node server/server.js",
          "develop": "concurrently \"cd server && npm run watch\" \"cd client && npm run dev\"",
          "install": "cd server && npm i && cd ../client && npm i",
          "build": "cd client && npm run build"
     },
     "keywords": [],
     "author": "",
     "license": "ISC",
     "devDependencies": {
          "concurrently": "^8.2.0"
     }
}
```

While still navigated to the parent directory in the terminal, use the command `npm run develop` to start the server and run the application. The terminal will provide a localhost URL to navigate to in your browser to view the application.

## Usage

After navigating to the application in your browser, you will be presented with a search bar to search for books. You can also navigate to the login/signup page to create an account or log in. Once logged in, you can save books to your account and view them later.

## License

This application is licensed under the MIT license. See the following link for more information: https://opensource.org/licenses/MIT

## Contributing

Feel free to contribute to this project! Please fork the repository and create a pull request with your changes.

## Tests

No tests are included in this application.

## Questions

If you have any questions, please contact me at drgstriker@aol.com. You can also visit my GitHub profile at https://github.com/RobSprouse.
