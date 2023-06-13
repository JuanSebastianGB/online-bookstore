import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { GenreModule } from './genre/genre.module';

@Module({
  imports: [GenreModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
