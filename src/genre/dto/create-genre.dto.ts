import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateGenreDto {
  @IsNotEmpty()
  @MinLength(3)
  name: string;
}
