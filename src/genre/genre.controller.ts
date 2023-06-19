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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { Book } from 'src/book/entities/book.entity';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { GenreService } from './genre.service';

@ApiTags('genres')
@Controller('genre')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Post()
  @ApiOkResponse({
    description: 'The genre has been successfully created',
    type: CreateGenreDto,
  })
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
  @ApiOkResponse({
    description: 'The genres have been successfully retrieved',
    type: [CreateGenreDto],
  })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  async findAll(@Query('skip') skip?: number, @Query('take') take?: number) {
    try {
      return await this.genreService.findAll(+skip, +take);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'The genres have been successfully retrieved',
    type: CreateGenreDto,
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.genreService.findOne(id);
    } catch (e) {
      throw new NotFoundException();
    }
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'The genre has been successfully updated',
    type: UpdateGenreDto,
  })
  @ApiBody({ type: UpdateGenreDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGenreDto: UpdateGenreDto,
  ) {
    try {
      return await this.genreService.update(id, updateGenreDto);
    } catch (e) {
      console.error(e);
      if (e.message === 'Genre not found')
        throw new NotFoundException('Genre not found');
      if (e.code === 'P2002')
        throw new BadRequestException('Genre name already exists');
      throw new BadRequestException();
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.genreService.remove(id);
    } catch (e) {
      throw new NotFoundException();
    }
  }

  @Get(':id/books')
  @ApiOkResponse({
    description: 'The books have been successfully retrieved',
    type: [Book],
  })
  async findBooksByGenreId(@Param('id', ParseIntPipe) id: number) {
    return await this.genreService.findBooksByGenreId(id);
  }
}
