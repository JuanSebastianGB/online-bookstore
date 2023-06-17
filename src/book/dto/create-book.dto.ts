import { IsNumber, IsOptional, Max, Min, MinLength } from 'class-validator';

export class CreateBookDto {
  @MinLength(3)
  title: string;

  @MinLength(3)
  author: string;

  @MinLength(15)
  description: string;

  @IsNumber()
  @Min(10)
  @Max(200)
  price: number;

  @MinLength(5)
  @IsOptional()
  coverImage: string;

  @IsOptional()
  genres: number[];
}
