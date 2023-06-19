import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { encryptPassword } from 'src/utils';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password: pwd } = createUserDto;
    const password = await encryptPassword(pwd);
    return await this.prismaService.user.create({
      data: { ...createUserDto, password },
    });
  }

  async findAll(
    skip: number,
    take: number,
  ): Promise<{
    users: User[];
    total: number;
  }> {
    if (!skip || skip < 0) skip = 0;
    if (!take || take < 0) take = 10;
    const [users, total] = await Promise.all([
      this.prismaService.user.findMany({
        skip,
        take,
      }),
      this.prismaService.user.count(),
    ]);
    return { users, total };
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
    if (!user) return null;
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

  async remove(id: number) {
    await this.findOne(id);
    await this.prismaService.user.delete({ where: { id } });
  }
}
