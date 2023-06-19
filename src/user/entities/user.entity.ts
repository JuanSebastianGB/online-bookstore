import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class User {
  @ApiProperty()
  id: number;
  @ApiProperty()
  email: string;
  @ApiProperty()
  role: UserRole;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}

export class UserResponseDto {
  @ApiProperty({ type: [User] })
  users: User[];

  @ApiProperty()
  total: number;
}
