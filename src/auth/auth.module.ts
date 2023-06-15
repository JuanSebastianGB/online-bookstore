import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [PassportModule],
  providers: [AuthService, UserService, PrismaService, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
