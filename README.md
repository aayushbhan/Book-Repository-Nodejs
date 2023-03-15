# Book-Repository-Nodejs

API Documentation 

* [Register](https://github.com/aayushbhan/Book-Repository-Nodejs/blob/main/BookRepositoryServer/app.js#L54) 
  * Request Type - POST
  * Request Body -
      * First Name
      * Last Name
      * Email
      * Password
  * Response - 
      * Returns a 400 on invalid input
      * Returns a 409 if user already exists
      * Returns a 201 on successful user creation
          * Body - 
              * User Object
              * JWT Token

* [Login](https://github.com/aayushbhan/Book-Repository-Nodejs/blob/main/BookRepositoryServer/app.js#L106)
    * Request Type - POST
    * Request Body -
      * Email
      * Password
    * Response - 
      * Returns a 400 on invalid input
      * Returns a 400 if the user gives invalid credentials
      * Returns a 200 on successful user login
          * Body - 
              * User Object
              * JWT Token

* [Add Book](https://github.com/aayushbhan/Book-Repository-Nodejs/blob/main/BookRepositoryServer/app.js#L143)
    * Request Type - PUT
    * Request Body -
      * Book Id
      * Title
      * Author
    * Response - 
      * Returns a 400 on invalid input
      * Returns a 409 if the book already exists
      * Returns a 201 on successful Book creation
          * Body - 
              * Book Object

* [Update Book](https://github.com/aayushbhan/Book-Repository-Nodejs/blob/main/BookRepositoryServer/app.js#L178)
    * Request Type - POST
    * Request Params - 
        * BookID
    * Request Body -
      * Title
      * Author
    * Response - 
      * Returns a 400 on invalid input
      * Returns a 400 if the book does not exist
      * Returns a 200 on successful Book update
          * Body - 
              * Message - "Update " + BookId

* [Delete](https://github.com/aayushbhan/Book-Repository-Nodejs/blob/main/BookRepositoryServer/app.js#L219)
    * Request Type - DELETE
    * Request Params - 
        * BookID
    * Response - 
      * Returns a 400 on invalid input
      * Returns a 400 if the book does not exist
      * Returns a 200 on successful Book deletion
          * Body - 
              * Message - "Deleted " + BookId

* [Search Book](https://github.com/aayushbhan/Book-Repository-Nodejs/blob/main/BookRepositoryServer/app.js#L248)
    * Request Type - GET
    * Query Params - 
        * BookID
    * Response - 
      * Returns a 400 on invalid input
      * Returns a 404 if the book does not exist
      * Returns a 200 on successful Book search
          * Body - 
              * Book Object

* [List Books](https://github.com/aayushbhan/Book-Repository-Nodejs/blob/main/BookRepositoryServer/app.js#L280)
    * Request Type - GET
    * Query Params - 
        * Page
        * Limit
    * Response - 
      * Returns a 404 if the book does not exist
      * Returns a 200 on successful paginated books listing
          * Body - 
              * List of Book Objects
