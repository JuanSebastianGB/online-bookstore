import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: CreateUserDto,
  })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.userService.create(createUserDto);
    } catch (error) {
      console.error({ error });
      if (error.code === 'P2002')
        throw new BadRequestException('User already exists');
      throw new BadRequestException();
    }
  }

  @Get()
  @ApiOkResponse({
    description: 'The users have been successfully retrieved.',
    type: UserResponseDto,
  })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  async findAll(@Query('skip') skip?: number, @Query('take') take?: number) {
    return await this.userService.findAll(+skip, +take);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'The user has been successfully retrieved.',
    type: CreateUserDto,
  })
  @ApiNotFoundResponse({
    description: 'The user with the provided id was not found.',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.userService.findOne(id);
    } catch (e) {
      throw new NotFoundException();
    }
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'The user has been successfully updated.',
    type: CreateUserDto,
  })
  @ApiNotFoundResponse({
    description: 'The user with the provided id was not found.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'The user has been successfully deleted.',
    type: CreateUserDto,
  })
  @ApiNotFoundResponse({
    description: 'The user with the provided id was not found.',
  })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.userService.remove(id);
    } catch (error) {
      if (error.code === 'P2016' || error.message === 'User not found')
        throw new NotFoundException('User not found');
      throw new BadRequestException();
    }
  }
}
