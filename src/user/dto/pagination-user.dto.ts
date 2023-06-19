import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UserPaginationResponseDto {
  @ApiProperty({
    description: 'List of users',
    type: [User],
  })
  users: User[];

  @ApiProperty({
    description: 'Total number of users',
    type: Number,
  })
  total: number;
}
