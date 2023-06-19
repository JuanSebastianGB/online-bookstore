import { ApiProperty } from '@nestjs/swagger';

export class Author {
  @ApiProperty({ type: Number, description: 'The id of the author' })
  id: number;

  @ApiProperty({ type: String, description: 'The name of the author' })
  name: string;

  @ApiProperty({ type: [Number], description: 'The books of the author' })
  books: number[];
}
