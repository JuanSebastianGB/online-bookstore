import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsEmail()
  @IsOptional()
  @ApiProperty()
  email: string;

  @IsString()
  @MinLength(5)
  @IsOptional()
  @ApiProperty()
  password: string;
}
