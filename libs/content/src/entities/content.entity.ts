import { ApiProperty } from '@nestjs/swagger';
import { IContent } from '../interfaces';

export class ContentEntity implements IContent {
  @ApiProperty()
  id: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  expireAt: number;
}
