import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { encryptPassword } from 'src/utils';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  /**
   * This function creates a new user by encrypting their password and using Prisma to save their data.
   * @param {CreateUserDto} createUserDto - `createUserDto` is an object that contains the data needed to
   * create a new user. It typically includes properties such as `username`, `email`, and `password`. The
   * properties may vary depending on the specific requirements of the application.
   * @returns The `create` method is returning a Promise that resolves to a `User` object. The `User`
   * object is created by calling the `create` method of the `prismaService.user` object with the `data`
   * parameter set to an object that contains the properties of the `createUserDto` object and the
   * encrypted `password`.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password: pwd } = createUserDto;
    const password = await encryptPassword(pwd);
    return await this.prismaService.user.create({
      data: { ...createUserDto, password },
    });
  }

  /**
   * This function finds all users with pagination and returns them along with the total number of
   * users.
   * @param {number} skip - The number of records to skip before starting to return results.
   * @param {number} take - The `take` parameter is used to specify the maximum number of records to be
   * returned from the database query. It is used in conjunction with the `skip` parameter to implement
   * pagination. If `take` is not provided or is less than 0, the default value of 10 is used.
   * @returns A Promise that resolves to an object containing an array of User objects and a total count
   * of users.
   */
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

  /**
   * This function finds a user by their ID and returns it, or throws an error if the user is not found.
   * @param {number} id - The `id` parameter is a number that represents the unique identifier of a user.
   * The `findOne` method uses this parameter to search for a user in the database using the Prisma
   * client. If a user with the specified `id` is found, the method returns the user object. If no
   * @returns The `findOne` method returns a `Promise` that resolves to a `User` object if a user with
   * the specified `id` is found in the database. If no user is found, it throws an error with the
   * message "User not found".
   */
  async findOne(id: number): Promise<User | undefined> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) throw new Error('User not found');
    return user;
  }

  /**
   * This function finds a user by their email and returns it as a Promise, or returns undefined if the
   * user is not found.
   * @param {string} email - The `email` parameter is a string that represents the email address of the
   * user that we want to find in the database. This function uses the Prisma ORM to query the database
   * and find a user with the specified email address. If a user is found, it is returned as a `User`
   * @returns A Promise that resolves to either a User object or undefined. If the user is not found, the
   * function returns null.
   */
  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!user) return null;
    return user;
  }

  /**
   * This function finds a user by their email and returns it as a Promise, or throws an error if the
   * user is not found.
   * @param {string} email - The `email` parameter is a string that represents the email address of the
   * user that we want to find in the database. This function uses the Prisma ORM to query the database
   * and find a user with the specified email address. If the user is found, the function returns the
   * user object. If
   * @returns a Promise that resolves to a User object or undefined if the user is not found.
   */
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

  /**
   * This function removes a user with a specific ID using Prisma ORM in an async manner.
   * @param {number} id - The `id` parameter is a number that represents the unique identifier of a user
   * that needs to be removed from the database. The function uses this parameter to first find the user
   * with the given `id` using the `findOne` method, and then deletes the user using the `delete` method
   * of
   */
  async remove(id: number) {
    await this.findOne(id);
    await this.prismaService.user.delete({ where: { id } });
  }
}
