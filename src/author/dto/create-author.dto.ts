import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  @MinLength(5)
  @ApiProperty()
  name: string;

  @IsOptional()
  @ApiProperty({ required: false, type: [Number] })
  books?: number[];
}
