import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  async create(@Body() createBookDto: CreateBookDto) {
    try {
      const book = await this.bookService.create(createBookDto);
      return book;
    } catch (error) {
      if (error.code === 'P2002')
        throw new NotFoundException('Book already exists');
      throw new BadRequestException();
    }
  }

  @Get()
  async findAll() {
    return await this.bookService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id) {
    try {
      return await this.bookService.findOne(id);
    } catch (error) {
      throw new NotFoundException();
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    try {
      return await this.bookService.update(id, updateBookDto);
    } catch (error) {
      if (error.code === 'P2002')
        throw new NotFoundException('Book already exists');
      throw new BadRequestException();
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id) {
    try {
      return await this.bookService.remove(id);
    } catch (error) {
      throw new NotFoundException();
    }
  }

  @Get(':id/genres')
  async findGenresByBookId(@Param('id', ParseIntPipe) id) {
    try {
      return await this.bookService.findGenresByBookId(id);
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
