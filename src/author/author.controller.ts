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

import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Author } from './entities/author.entity';

@ApiTags('authors')
@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Author,
  })
  @ApiBadRequestResponse({ description: 'Bad request.' })
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
  @ApiOkResponse({
    description: 'The authors have been successfully retrieved.',
    type: [Author],
  })
  async findAll() {
    return this.authorService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'The author has been successfully retrieved.',
    type: Author,
  })
  @ApiNotFoundResponse({ description: 'Author not found.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.authorService.findOne(id);
    } catch (error) {
      if (error.code === 'P2016')
        throw new NotFoundException('Author not found');
      throw new BadRequestException();
    }
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'The author has been successfully updated.',
    type: Author,
  })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  @ApiNotFoundResponse({ description: 'Author not found.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
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
  @ApiNoContentResponse({
    description: 'The author has been successfully deleted.',
  })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  @ApiNotFoundResponse({ description: 'Author not found.' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.authorService.remove(id);
    } catch (error) {
      if (error.code === 'P2016')
        throw new NotFoundException('Author not found');
      throw new BadRequestException();
    }
  }

  @Get(':id/books')
  @Get(':id/books')
  @ApiOkResponse({
    description: 'The books by the author have been successfully retrieved.',
    type: [Author],
  })
  @ApiNotFoundResponse({ description: 'Author not found.' })
  async findBooksByAuthorId(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.authorService.findBooksByAuthorId(id);
    } catch (error) {
      if (error.code === 'P2016')
        throw new NotFoundException('Author not found');
      throw new BadRequestException();
    }
  }
}
