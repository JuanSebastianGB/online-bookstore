import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;
    return await this.prismaService.user.create({
      data: { ...createUserDto },
    });
  }

  async findAll(): Promise<User[]> {
    return await this.prismaService.user.findMany();
  }

  async findOne(id: number): Promise<User | undefined> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) throw new Error('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!user) throw new Error('User not found');
    return user;
  }

  async findByUsername(email: string): Promise<User | undefined> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!user) throw new Error('User not found');
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
