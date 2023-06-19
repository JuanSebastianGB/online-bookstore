import { ApiProperty } from '@nestjs/swagger';
import { Author } from 'src/author/entities/author.entity';
import { Genre } from 'src/genre/entities/genre.entity';

export class Book {
  @ApiProperty()
  id: number;
  @ApiProperty()
  title: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  price: number;
  @ApiProperty()
  coverImage: string | null;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  authorId: number | null;

  @ApiProperty()
  author: Author | null;

  @ApiProperty()
  genres: Genre[];
}

export class BookResponseDto {
  @ApiProperty({ type: [Book] })
  books: Book[];

  @ApiProperty()
  total: number;
}
