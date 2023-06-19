import { Injectable } from '@nestjs/common';
import { Book } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(private prismaService: PrismaService) {}
  /**
   * This is an async function that creates a book with its genres and returns the book with its genres
   * included.
   * @param {CreateBookDto} createBookDto - `createBookDto` is an object that contains the data needed to
   * create a new book. It likely includes properties such as `title`, `author`, `description`,
   * `publicationDate`, and an array of `genres`.
   * @returns The `create` method is returning a Promise that resolves to a newly created book object
   * that includes the book data provided in the `createBookDto` parameter and the genres associated with
   * the book. The genres are connected to the book using their IDs, which are provided in the `genres`
   * array of the `createBookDto`. The book object also includes the genre IDs and names in the `genres
   */
  async create(createBookDto: CreateBookDto) {
    const { genres, ...data } = createBookDto;
    return await this.prismaService.book.create({
      data: {
        ...data,
        genres: {
          connect: genres?.map((genreId) => ({ id: genreId })),
        },
      },
      include: {
        genres: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  /**
   * This is an async function that finds all books with their genres and returns them along with the
   * total count.
   * @param {number} skip - The number of items to skip before starting to return results. If not
   * provided or less than 0, it defaults to 0.
   * @param {number} take - The number of items to retrieve from the database.
   * @returns A Promise that resolves to an object with two properties: "books" which is an array of Book
   * objects with their associated genres, and "total" which is the total number of books in the
   * database.
   */
  async findAll(
    skip: number,
    take: number,
  ): Promise<{
    books: Book[];
    total: number;
  }> {
    if (!skip || skip < 0) skip = 0;
    if (!take || take < 0) take = 10;
    const [books, total] = await Promise.all([
      this.prismaService.book.findMany({
        include: {
          genres: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      }),
      this.prismaService.book.count(),
    ]);
    return { books, total };
  }

  /**
   * This function finds a book by its ID and includes its genres and author using Prisma ORM and returns
   * a Promise of Book or undefined.
   * @param {number} id - The id parameter is a number that represents the unique identifier of a book.
   * It is used to query the database and retrieve a specific book with the matching id.
   * @returns The `findOne` method returns a `Promise` that resolves to a `Book` object with the
   * specified `id`. If the book is not found, it throws an error with the message "Book not found". The
   * returned `Book` object includes its associated `genres` and `author` objects, with only their `id`
   * and `name` properties selected.
   */
  async findOne(id: number): Promise<Book | undefined> {
    const book = await this.prismaService.book.findUnique({
      where: { id },
      include: {
        genres: {
          select: {
            id: true,
            name: true,
          },
        },
        author: true,
      },
    });
    if (!book) throw new Error('Book not found');
    return book;
  }

  /**
   * This is an async function that updates a book's information and genres in a database using Prisma
   * ORM.
   * @param {number} id - The ID of the book that needs to be updated.
   * @param {UpdateBookDto} updateBookDto - UpdateBookDto is a data transfer object that contains the
   * updated information for a book. It may include properties such as title, author, description, and an
   * array of genre IDs.
   * @returns The `update` method is returning a `Promise` that resolves to a `Book` object.
   */
  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id);
    const { genres, ...data } = updateBookDto;
    return await this.prismaService.book.update({
      where: { id: book.id },
      data: {
        ...data,
        genres: {
          set: genres ? genres.map((genreId) => ({ id: genreId })) : undefined,
        },
      },
      include: {
        genres: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  /**
   * This function removes a book from the database using its ID.
   * @param {number} id - The `id` parameter is a number that represents the unique identifier of a book
   * that needs to be removed from the database. The function uses this parameter to find the book using
   * the `findOne` method and then deletes it using the `delete` method provided by the Prisma client.
   * The function returns
   * @returns The `remove` method is returning a `Promise` that resolves to a `Book` object. The `Book`
   * object is obtained by first calling the `findOne` method with the `id` parameter to retrieve the
   * book with the specified `id`. Then, the `book.delete` method of the `prismaService` is called with
   * the `id` of the retrieved book to delete it
   */
  async remove(id: number): Promise<Book> {
    const book = await this.findOne(id);
    return await this.prismaService.book.delete({
      where: { id: book.id },
    });
  }

  /**
   * This function finds the genres associated with a book by its ID using Prisma ORM and returns them.
   * @param {number} id - The id parameter is a number that represents the unique identifier of a book.
   * It is used to query the database and retrieve the book's information, including its associated
   * genres.
   * @returns The function `findGenresByBookId` is returning an array of genres associated with a book
   * identified by the `id` parameter. If the book is not found, it throws an error.
   */
  async findGenresByBookId(id: number) {
    const book = await this.prismaService.book.findUnique({
      where: { id },
      include: {
        genres: true,
      },
    });
    if (!book) throw new Error('Book not found');
    return book.genres;
  }
}
