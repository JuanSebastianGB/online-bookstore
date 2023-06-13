import { PartialType } from '@nestjs/mapped-types';
import { MinLength } from 'class-validator';
import { CreateGenreDto } from './create-genre.dto';

export class UpdateGenreDto extends PartialType(CreateGenreDto) {
  @MinLength(3)
  name: string;
}
