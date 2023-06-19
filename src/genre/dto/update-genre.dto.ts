import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';
import { CreateGenreDto } from './create-genre.dto';

export class UpdateGenreDto extends PartialType(CreateGenreDto) {
  @MinLength(3)
  @ApiProperty({
    description: 'The name of the genre',
    minLength: 3,
    default: 'Fantasy',
  })
  name: string;
}
