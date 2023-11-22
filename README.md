# DOMAIN Link:
https://www.isitrainingoutside.jumpingcrab.com 

# WTWR (What to Wear?): Back End
The back-end project is focused on creating a server for the WTWR application. You’ll gain a deeper understanding of how to work with databases, set up security and testing, and deploy web applications on a remote machine. The eventual goal is to create a server with an API and user authorization.

## Functionality
1. **API Endpoints:** Various CRUD (Create, Read. Update, Delete) operations for interacting with clothing items and user data.

2. **Data Management:** Efficient data storage and retrieval with MongoDB

3. **Testing:** Utilizing Postman for API testing to ensure endpoint reliability

## Technologies and Techniques
1. **Node.js & Express.js:** The server is built using Node.js with Express.js facilitating the creation of API endpoints and handling HTTP requests.

2. **MongoDB:** A NoSQL database used to store user data and clothing items.

3. **Postman:** A tool used for testing API endpoints to ensure they behave as expected.

4. **Security and Authorization:**
  - **JWT (JSON Web Tokens):** Implementing JWT for secure user authentication and to maintain session integrity.
  - **Helmet:**  Utilizing Helmet to set various HTTP headers for app protection.
  - **CORS (Cross-Origin Resource Sharing):** Enabling CORS to allow for secure and controlled access to the server resources from different domains.


## Running the Project
`npm run start` — to launch the server 

`npm run dev` — to launch the server with the hot reload feature

## Updates and Security Enhancements
The latest update to the WTWR backend includes;

- Integration of JWT for secure and scalable user authorization.
- The addition of Helmet to fortify the app against a range of common security vulnerabilities.
- Implementation of CORS to manage cross-origin requests, ensuring that only authorized domains can interact with the API.

These enhancements not only make the server more secure but also align with industry best practices for web application development.

### Testing
Before committing your code, make sure you edit the file `sprint.txt` in the root folder. The file `sprint.txt` should contain the number of the sprint you're currently working on. For ex. 12
