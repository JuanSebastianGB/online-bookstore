import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  @MinLength(5)
  name: string;

  @IsOptional()
  books?: number[];
}
