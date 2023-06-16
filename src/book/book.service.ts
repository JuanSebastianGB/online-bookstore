import { Injectable } from '@nestjs/common';
import { Book } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(private prismaService: PrismaService) {}
  async create(createBookDto: CreateBookDto) {
    return await this.prismaService.book.create({
      data: { ...createBookDto },
    });
  }

  async findAll(): Promise<Book[]> {
    return await this.prismaService.book.findMany();
  }

  async findOne(id: number): Promise<Book | undefined> {
    const book = await this.prismaService.book.findUnique({
      where: { id },
    });
    if (!book) throw new Error('Book not found');
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id);
    return await this.prismaService.book.update({
      where: { id: book.id },
      data: { ...updateBookDto },
    });
  }

  async remove(id: number): Promise<Book> {
    const book = await this.findOne(id);
    return await this.prismaService.book.delete({
      where: { id: book.id },
    });
  }
}
