import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max, Min, MinLength } from 'class-validator';

export class CreateBookDto {
  @MinLength(3)
  @ApiProperty()
  title: string;

  @MinLength(15)
  @ApiProperty()
  description: string;

  @IsNumber()
  @Min(10)
  @Max(200)
  @ApiProperty()
  price: number;

  @MinLength(5)
  @IsOptional()
  @ApiProperty()
  coverImage: string;

  @IsOptional()
  @ApiProperty({ type: [Number] })
  genres: number[];

  @IsNumber()
  @ApiProperty({
    description: 'The author id',
    default: 1,
  })
  authorId: number;
}
