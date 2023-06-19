import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateGenreDto {
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({
    description: 'The name of the genre',
    minLength: 3,
    default: 'Fantasy',
  })
  name: string;
}
