# bookstore-online

Welcome to **bookstore-online**! This application is built with NestJS and provides a powerful platform for managing books, user reviews, shopping carts, and more. It incorporates various features such as user management, book management, user reviews and ratings, shopping cart functionality, and a cache system to enhance performance. Read on to learn more about the application and its capabilities.

## Table of Contents

- [Requirements]
- [Installation]
- [Usage]
- [Authentication]
- [API Endpoints]
- [Caching]
- [License]

## Requirements

To run this application, ensure that you have the following dependencies installed:

- Node.js based,
- NestJS (Node.js Framework)
- pnpm (Node Package Manager)
- pnpm (Node Package Manager)
- Redis (or any other caching mechanism of your choice)

## Installation

Follow these steps to get the application up and running on your local machine:

1.  Clone the repository:

bashCopy code

`git clone https://github.com/your/repository.git`

2.  Install the dependencies:

bashCopy code

`cd application-folder
pnpm install`

3.  Configure the application:

    - Rename the `.env.example` file to `.env` and modify the environment variables as needed.
    - Set up the connection to your Redis server in the application's configuration file.

4.  Build the application:

bashCopy code

`pnpm run build`

5.  Start the application:

bashCopy code

`pnpm start`

Congratulations! The application is now running on your local machine.

## Usage

Once the application is up and running, you can access it via the provided endpoints. The API is secured using JWT-based authentication. Follow the [Authentication](https://chat.openai.com/#authentication) section for details on obtaining access tokens.

## Authentication

The application uses JWT-based authentication for user registration, login, and access control. To authenticate and access protected endpoints, you need to include the JWT access token in the `Authorization` header of your requests.

To register a new user, make a `POST` request to `/auth/register` with the required user details. On successful registration, you will receive a JWT access token in the response.

To log in, make a `POST` request to `/auth/login` with your registered credentials. The response will include a JWT access token.

Include the access token in the `Authorization` header as follows:

bashCopy code

`Authorization: Bearer <access_token>`

## API Endpoints

The application provides the following API endpoints for managing users, books, user reviews, shopping carts, and orders:

- **User Management**

  - `POST /auth/register` - Register a new user.
  - `POST /auth/login` - Log in and obtain an access token.
  - `GET /users` - Get a list of all users (admin-only).

- **Book Management**

  - `GET /books` - Get a list of all books.
  - `GET /books/:id` - Get details of a specific book.
  - `POST /books` - Create a new book (admin-only).
  - `PUT /books/:id` - Update the details of a book (admin-only).
  - `DELETE /books/:id` - Delete a book (admin-only).

- **User Reviews and Ratings**

  - `GET /books/:id/reviews` - Get all reviews for a book.
  - `POST /books/:id/reviews` - Add a new review for a book.
  - `PUT /books/:id/reviews/:reviewId` - Update a review for a book.
  - `DELETE /books/:id/reviews/:reviewId` - Delete a review for a book.

- **Shopping Cart and Orders**

  - `GET /cart` - Get the contents of the shopping cart.
  - `POST /cart/add` - Add a book to the shopping cart.
  - `DELETE /cart/remove/:id` - Remove a book from the shopping cart.
  - `GET /orders` - Get a list of all orders.
  - `GET /orders/:id` - Get details of a specific order.
  - `POST /orders` - Place a new order.

Refer to the API documentation or explore the code for further details on request and response payloads.

## Caching

The application implements a caching system using Redis (or any other caching mechanism of your choice) to improve performance. Frequently accessed book data, such as book details and genres, are cached to reduce the load on the database.

To configure the cache system, ensure that you have a running Redis server and set up the connection in the application's configuration file. The cache will automatically be utilized when retrieving book details and genres.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT). Feel free to use and modify the code as per the license terms.
