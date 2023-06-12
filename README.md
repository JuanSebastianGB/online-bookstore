Requirements

1.  User Management:

    - User registration and login using JWT-based authentication.
    - Password hashing and secure storage.
    - User roles (admin and regular users) for access control.

2.  Book Management:

    - CRUD operations for books (title, author, description, price, etc.).
    - Ability to upload book cover images using file upload.
    - Categorization of books into different genres.
    - Many-to-many relationship between books and genres (a book can belong to multiple genres, and a genre can have multiple books).

3.  User Reviews and Ratings:

    - Users can add reviews and ratings for books.
    - One-to-many relationship between books and user reviews (a book can have multiple reviews, and each review is associated with a book and a user).

4.  Shopping Cart and Orders:

    - Users can add books to their shopping cart and place orders.
    - One-to-many relationship between users and orders (a user can have multiple orders, and each order is associated with a user).
    - Many-to-many relationship between books and orders (a book can be part of multiple orders, and an order can contain multiple books).

5.  Cache System:

    - Implement a caching system using Redis or any other caching mechanism of your choice.
    - Cache frequently accessed book data, such as book details and genres, to improve performance.
