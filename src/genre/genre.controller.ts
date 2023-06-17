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
  Post
} from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { GenreService } from './genre.service';

@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Post()
  async create(@Body() createGenreDto: CreateGenreDto) {
    try {
      return await this.genreService.create(createGenreDto);
    } catch (e) {
      if (e.code === 'P2002')
        throw new BadRequestException('Genre name already exists');
      throw new BadRequestException();
    }
  }

  @Get()
  async findAll() {
    return await this.genreService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id) {
    try {
      return await this.genreService.findOne(id);
    } catch (e) {
      throw new NotFoundException();
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id,
    @Body() updateGenreDto: UpdateGenreDto,
  ) {
    try {
      return await this.genreService.update(id, updateGenreDto);
    } catch (e) {
      if (e.code === 'P2002')
        throw new BadRequestException('Genre name already exists');
      throw new BadRequestException();
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id) {
    try {
      return await this.genreService.remove(id);
    } catch (e) {
      throw new NotFoundException();
    }
  }
}
