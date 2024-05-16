import { HttpException, HttpStatus } from '@nestjs/common';

export class ContentExpiredException extends HttpException {
  constructor(id: string) {
    const errorMessage = `Content with ID ${id} has expired.`;
    super(errorMessage, HttpStatus.GONE);
  }
}
