import {
  BadRequestException,
  Controller,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';
import { LocalGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  @UseGuards(LocalGuard)
  @Post('login')
  async login(@Request() req: any) {
    try {
      return req.user;
    } catch (error) {
      console.error({ error });
      throw new BadRequestException(error.message);
    }
  }
}
