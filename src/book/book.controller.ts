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
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookResponseDto } from './entities/book.entity';

@Controller('book')
@ApiTags('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: CreateBookDto,
  })
  @ApiBody({ type: CreateBookDto })
  async create(@Body() createBookDto: CreateBookDto) {
    try {
      const book = await this.bookService.create(createBookDto);
      return book;
    } catch (error) {
      if (error.code === 'P2002')
        throw new BadRequestException('Book already exists');
      if (error.code === 'P2025')
        throw new BadRequestException('Genre not found');
      if (error.code === 'P2003')
        throw new BadRequestException('Author not found');
      throw new BadRequestException();
    }
  }

  @Get()
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @ApiOkResponse({
    description: 'The books have been successfully retrieved.',
    type: [BookResponseDto],
  })
  async findAll(@Query('skip') skip?: number, @Query('take') take?: number) {
    try {
      return await this.bookService.findAll(+skip, +take);
    } catch (error) {
      if (error.code === 'P2002')
        throw new BadRequestException('Book already exists');
      if (error.code === 'P2025')
        throw new BadRequestException('Genre not found');
      if (error.code === 'P2003')
        throw new BadRequestException('Author not found');
      throw new BadRequestException();
    }
  }

  @Get(':id')
  @ApiParam({ name: 'id', required: true })
  async findOne(@Param('id', ParseIntPipe) id) {
    try {
      return await this.bookService.findOne(id);
    } catch (error) {
      throw new NotFoundException();
    }
  }

  @Patch(':id')
  @ApiParam({ name: 'id', required: true })
  async update(
    @Param('id', ParseIntPipe) id,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    try {
      return await this.bookService.update(id, updateBookDto);
    } catch (error) {
      if (error.code === 'P2002')
        throw new BadRequestException('Book already exists');
      if (error.code === 'P2016' || error.message === 'Author not found')
        throw new NotFoundException('Author not found');
      throw new BadRequestException();
    }
  }

  @Delete(':id')
  @ApiParam({ name: 'id', required: true })
  async remove(@Param('id', ParseIntPipe) id) {
    try {
      return await this.bookService.remove(id);
    } catch (error) {
      throw new NotFoundException();
    }
  }

  @Get(':id/genres')
  @ApiParam({ name: 'id', required: true })
  async findGenresByBookId(@Param('id', ParseIntPipe) id) {
    try {
      return await this.bookService.findGenresByBookId(id);
    } catch (error) {
      if (error.code === 'P2016' || error.message === 'Book not found')
        throw new NotFoundException('Book not found');
    }
  }
}
