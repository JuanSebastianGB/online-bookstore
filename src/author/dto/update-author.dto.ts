import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { CreateAuthorDto } from './create-author.dto';

export class UpdateAuthorDto extends PartialType(CreateAuthorDto) {
  @IsString()
  @MinLength(5)
  @ApiProperty()
  @IsOptional()
  name?: string;

  @IsOptional()
  @ApiProperty({ required: false, type: [Number] })
  books?: number[];
}
