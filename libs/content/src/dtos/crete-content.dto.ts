import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString, Validate } from 'class-validator';
import { IsFutureDate } from 'libs/common/validations';

export class CreateContentDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Content is required and cannot be empty.' })
  @IsString({ message: 'Content must be a string.' })
  content: string;

  @ApiProperty({
    description:
      'The expiration date and time for the content, after which the content should no longer be accessible.',
    example: '2023-12-31T23:59:59.000Z',
    type: 'string',
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  @Validate(IsFutureDate)
  expireAt: Date;
}
