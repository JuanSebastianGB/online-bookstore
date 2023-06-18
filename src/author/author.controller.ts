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
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  async create(@Body() createAuthorDto: CreateAuthorDto) {
    try {
      return await this.authorService.create(createAuthorDto);
    } catch (error) {
      console.log({ error });
      if (error.code === 'P2002')
        throw new BadRequestException('Author already exists');
      throw new BadRequestException();
    }
  }

  @Get()
  async findAll() {
    return this.authorService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id) {
    try {
      return await this.authorService.findOne(id);
    } catch (error) {
      if (error.code === 'P2016')
        throw new NotFoundException('Author not found');
      throw new BadRequestException();
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ) {
    try {
      return await this.authorService.update(id, updateAuthorDto);
    } catch (error) {
      if (error.code === 'P2016')
        throw new NotFoundException('Author not found');
      if (error.code === 'P2002')
        throw new BadRequestException('Author already exists');
      throw new BadRequestException();
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id) {
    try {
      return this.authorService.remove(id);
    } catch (error) {
      if (error.code === 'P2016')
        throw new NotFoundException('Author not found');
      throw new BadRequestException();
    }
  }

  @Get(':id/books')
  async findBooksByAuthorId(@Param('id', ParseIntPipe) id) {
    try {
      return this.authorService.findBooksByAuthorId(id);
    } catch (error) {
      if (error.code === 'P2016')
        throw new NotFoundException('Author not found');
      throw new BadRequestException();
    }
  }
}
