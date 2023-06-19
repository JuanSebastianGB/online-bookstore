import { Injectable, NotFoundException } from '@nestjs/common';
import { Genre } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenreService {
  constructor(private prismaService: PrismaService) {}

  async create(createGenreDto: CreateGenreDto): Promise<Genre | undefined> {
    const genre = await this.prismaService.genre.create({
      data: {
        ...createGenreDto,
      },
    });
    return genre;
  }

  async findAll(skip = 0, take = 0): Promise<Genre[]> {
    if (!skip || skip < 0) skip = 0;
    if (!take || take < 0) take = 10;
    const genres = await this.prismaService.genre.findMany({
      skip,
      take,
    });
    return genres;
  }

  async findOne(id: number): Promise<Genre | undefined> {
    const genre = await this.prismaService.genre.findUnique({
      where: { id },
    });
    if (!genre) throw new Error('Genre not found');
    return genre;
  }

  async update(id: number, updateGenreDto: UpdateGenreDto): Promise<Genre> {
    await this.findOne(id);
    return await this.prismaService.genre.update({
      where: { id },
      data: {
        ...updateGenreDto,
      },
    });
  }

  async remove(id: number): Promise<Genre[]> {
    const genre = await this.findOne(id);
    await this.prismaService.genre.delete({
      where: { id: genre.id },
    });
    return await this.findAll();
  }

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
