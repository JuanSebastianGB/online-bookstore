import { Injectable } from '@nestjs/common';
import { Book } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(private prismaService: PrismaService) {}
  async create(createBookDto: CreateBookDto) {
    const { genres, ...data } = createBookDto;
    return await this.prismaService.book.create({
      data: {
        ...data,
        genres: {
          connect: genres.map((genreId) => ({ id: genreId })),
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

  async findAll(): Promise<Book[]> {
    return await this.prismaService.book.findMany({
      include: {
        genres: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });
  }

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
      },
    });
    if (!book) throw new Error('Book not found');
    return book;
  }

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

  async remove(id: number): Promise<Book> {
    const book = await this.findOne(id);
    return await this.prismaService.book.delete({
      where: { id: book.id },
    });
  }

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
