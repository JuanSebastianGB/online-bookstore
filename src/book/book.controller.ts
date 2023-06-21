import { CacheKey } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Body,
  CacheTTL,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { unlink } from 'fs/promises';
import { diskStorage } from 'multer';
import { AuthGuard } from 'src/auth/auth.guard';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookResponseDto } from './entities/book.entity';

@Controller('book')
@ApiTags('books')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: CreateBookDto,
  })
  @ApiBody({ type: CreateBookDto })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File upload',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        createBookDto: {
          $ref: '#/components/schemas/CreateBookDto',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          const extension = file.mimetype.split('/')[1];
          return callback(null, `${randomName}.${extension}`);
        },
      }),
    }),
  )
  async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
    @Body() createBookDto: CreateBookDto,
  ) {
    try {
      const book = await this.bookService.create({
        ...createBookDto,
        coverImage: file?.filename,
      });
      return book;
    } catch (error) {
      if (file?.filename) await unlink(`./uploads/${file.filename}`);
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
  @CacheKey('books')
  @CacheTTL(20)
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
  async remove(@Param('id', ParseIntPipe) id: number) {
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
