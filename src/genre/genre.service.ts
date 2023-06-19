import { Injectable, NotFoundException } from '@nestjs/common';
import { Genre } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenreService {
  constructor(private prismaService: PrismaService) {}

  /**
   * This is an async function that creates a new genre using the data provided in the CreateGenreDto
   * object and returns the created genre.
   * @param {CreateGenreDto} createGenreDto - `createGenreDto` is a parameter of type `CreateGenreDto`.
   * It is an object that contains the data needed to create a new genre. The properties of this object
   * may include the name of the genre, a description, and any other relevant information. This parameter
   * is used to populate the `
   * @returns The `create` method is returning a `Promise` that resolves to a `Genre` object or
   * `undefined`.
   */
  async create(createGenreDto: CreateGenreDto): Promise<Genre | undefined> {
    const genre = await this.prismaService.genre.create({
      data: {
        ...createGenreDto,
      },
    });
    return genre;
  }

  /**
   * This function finds all genres with optional parameters for pagination.
   * @param [skip=0] - The number of records to skip before starting to return records. If skip is not
   * provided or is less than 0, it defaults to 0, meaning that no records are skipped.
   * @param [take=0] - The `take` parameter is used to limit the number of results returned by the
   * `findAll` method. It specifies the maximum number of genres that should be returned. If `take` is
   * not provided or is less than or equal to 0, the method will return a maximum of 10 genres
   * @returns The `findAll` method returns a Promise that resolves to an array of `Genre` objects. The
   * `Genre` objects are retrieved from the `prismaService` using the `findMany` method with the
   * specified `skip` and `take` parameters. If `skip` or `take` are not provided or are less than 0,
   * default values of 0 and 10 respectively are
   */
  async findAll(skip = 0, take = 0): Promise<Genre[]> {
    if (!skip || skip < 0) skip = 0;
    if (!take || take < 0) take = 10;
    const genres = await this.prismaService.genre.findMany({
      skip,
      take,
    });
    return genres;
  }

  /**
   * This function finds a genre by its ID and returns it, or throws an error if it is not found.
   * @param {number} id - The `id` parameter is a number that represents the unique identifier of a
   * genre. It is used to query the database and retrieve a single genre object that matches the
   * specified `id`. If no genre is found with the given `id`, an error is thrown.
   * @returns The `findOne` method returns a `Promise` that resolves to a `Genre` object if it is found
   * in the database, or `undefined` if it is not found. If the genre is not found, the method throws an
   * error with the message "Genre not found".
   */
  async findOne(id: number): Promise<Genre | undefined> {
    const genre = await this.prismaService.genre.findUnique({
      where: { id },
    });
    if (!genre) throw new Error('Genre not found');
    return genre;
  }

  /**
   * This function updates a genre in the database using the provided ID and data.
   * @param {number} id - The ID of the genre that needs to be updated.
   * @param {UpdateGenreDto} updateGenreDto - UpdateGenreDto is a data transfer object (DTO) that
   * contains the updated information for a genre. It is likely defined elsewhere in the codebase and
   * contains properties such as name, description, or any other fields that can be updated for a genre.
   * @returns The `update` method is returning a Promise that resolves to a `Genre` object. This object
   * represents the updated genre that was updated in the database using the provided `updateGenreDto`
   * and the `id` parameter.
   */
  async update(id: number, updateGenreDto: UpdateGenreDto): Promise<Genre> {
    await this.findOne(id);
    return await this.prismaService.genre.update({
      where: { id },
      data: {
        ...updateGenreDto,
      },
    });
  }

  /**
   * This function removes a genre with a given ID and returns all remaining genres.
   * @param {number} id - The id parameter is a number that represents the unique identifier of a genre
   * that needs to be removed from the database.
   * @returns The `remove` function returns a Promise that resolves to an array of `Genre` objects after
   * deleting the genre with the specified `id` from the database using the `prismaService`.
   */
  async remove(id: number): Promise<Genre[]> {
    const genre = await this.findOne(id);
    await this.prismaService.genre.delete({
      where: { id: genre.id },
    });
    return await this.findAll();
  }

  /**
   * This function finds books by a given genre ID using Prisma ORM and returns them.
   * @param {number} id - The id parameter is a number that represents the unique identifier of a genre.
   * This function uses this id to find a specific genre in the database and retrieve all the books that
   * belong to that genre.
   * @returns This function returns an array of books that belong to a genre with the specified ID. The
   * books array contains objects with the book ID and title. If the genre with the specified ID is not
   * found, a NotFoundException is thrown.
   */
  async findBooksByGenreId(id: number) {
    const genre = await this.prismaService.genre.findUnique({
      where: { id },
      include: {
        books: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
    if (!genre) throw new NotFoundException();
    return genre.books;
  }
}
