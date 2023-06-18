import { Injectable } from '@nestjs/common';
import { Author, Book } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorService {
  constructor(private prismaService: PrismaService) {}
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

  async findAll(): Promise<Author[]> {
    return await this.prismaService.author.findMany({
      include: { books: true },
    });
  }

  async findOne(id: number): Promise<Author | undefined> {
    const author = await this.prismaService.author.findUnique({
      where: { id },
    });
    if (!author) throw new Error('Author not found');
    return author;
  }

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

  async remove(id: number): Promise<Author> {
    const author = await this.findOne(id);
    return await this.prismaService.author.delete({
      where: { id: author.id },
    });
  }

  async findBooksByAuthorId(id: number): Promise<Book[]> {
    const author = await this.prismaService.author.findUnique({
      where: { id },
      include: { books: true },
    });
    return author.books;
  }
}
