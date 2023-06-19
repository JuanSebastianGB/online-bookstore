import { Injectable } from '@nestjs/common';
import { Author, Book } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorService {
  constructor(private prismaService: PrismaService) {}
  /**
   * This is an async function that creates a new author in a database using data provided in a DTO
   * object, including connecting any associated books.
   * @param {CreateAuthorDto} createAuthorDto - `createAuthorDto` is an object that contains the data
   * needed to create a new author. It is of type `CreateAuthorDto`, which is likely a custom interface
   * or class defined elsewhere in the codebase.
   * @returns The `create` method returns a Promise that resolves to an `Author` object or `undefined`.
   */
  async create(createAuthorDto: CreateAuthorDto): Promise<Author | undefined> {
    const { books, ...data } = createAuthorDto;
    const author = await this.prismaService.author.create({
      data: {
        ...data,
        books: {
          connect: books?.map((bookId) => ({ id: bookId })),
        },
      },
    });

    return author;
  }

  /**
   * This function finds all authors with their books, with optional parameters for pagination.
   * @param {number} skip - The number of records to skip before starting to return results. It is used
   * for pagination purposes.
   * @param {number} take - The `take` parameter is used to specify the maximum number of records to be
   * returned from the database query. In this case, it is used to limit the number of `Author` records
   * returned by the `findAll` method. If `take` is not provided or is less than 0,
   * @returns A promise that resolves to an array of Author objects, including their associated books,
   * with pagination applied based on the provided skip and take parameters.
   */
  async findAll(skip: number, take: number): Promise<Author[]> {
    if (!skip || skip < 0) skip = 0;
    if (!take || take < 0) take = 10;
    return await this.prismaService.author.findMany({
      include: { books: true },
      skip,
      take,
    });
  }

  /**
   * This function finds an author by their ID and includes their books using Prisma ORM, and returns the
   * author or throws an error if not found.
   * @param {number} id - The id parameter is a number that represents the unique identifier of the
   * author that we want to find.
   * @returns The `findOne` method returns a `Promise` that resolves to an `Author` object if an author
   * with the specified `id` is found in the database. If no author is found, it throws an error with the
   * message "Author not found". The `Author` object includes an array of `books` that are associated
   * with the author.
   */
  async findOne(id: number): Promise<Author | undefined> {
    const author = await this.prismaService.author.findUnique({
      where: { id },
      include: {
        books: true,
      },
    });
    if (!author) throw new Error('Author not found');
    return author;
  }

  /**
   * This is an async function that updates an author's information and their associated books in a
   * database using Prisma.
   * @param {number} id - The id parameter is a number that represents the unique identifier of the
   * author that needs to be updated.
   * @param {UpdateAuthorDto} updateAuthorDto - UpdateAuthorDto is a data transfer object that contains
   * the updated information for an author. It may include properties such as the author's name, age, and
   * nationality, as well as an array of book IDs that the author has written.
   * @returns The `update()` method is returning a Promise that resolves to an instance of the `Author`
   * class.
   */
  async update(id: number, updateAuthorDto: UpdateAuthorDto): Promise<Author> {
    const author = await this.findOne(id);
    const { books, ...data } = updateAuthorDto;
    return await this.prismaService.author.update({
      where: { id: author.id },
      data: {
        ...data,
        books: {
          set: books?.map((bookId) => ({
            id: bookId,
          })),
        },
      },
    });
  }

  /**
   * This function removes an author from the database by their ID.
   * @param {number} id - The `id` parameter is a number that represents the unique identifier of an
   * author that needs to be removed from the database.
   * @returns The `remove` method is returning a `Promise` that resolves to an `Author` object. The
   * `Author` object is obtained by first calling the `findOne` method with the `id` parameter to
   * retrieve the author from the database, and then calling the `delete` method of the
   * `prismaService.author` object to delete the author from the database. The `Author` object returned
   */
  async remove(id: number): Promise<Author> {
    const author = await this.findOne(id);
    return await this.prismaService.author.delete({
      where: { id: author.id },
    });
  }

  /**
   * This function finds books by author ID and returns them along with their genres and author
   * information.
   * @param {number} id - The `id` parameter is a number that represents the unique identifier of an
   * author. This function uses this parameter to query the database and retrieve all the books written
   * by the author with the specified `id`.
   * @returns The `findBooksByAuthorId` function returns a Promise that resolves to an array of `Book`
   * objects. The function uses the `prismaService` to find a unique author by their `id`, and includes
   * their associated books, genres, and author information. If an author is found, the function returns
   * an array of their books, otherwise an empty array is returned.
   */
  async findBooksByAuthorId(id: number): Promise<Book[]> {
    const author = await this.prismaService.author.findUnique({
      where: { id },
      include: {
        books: {
          include: {
            genres: {
              select: { name: true, id: true },
            },
            author: {
              select: { name: true, id: true },
            },
          },
        },
      },
    });

    return author?.books || [];
  }
}
