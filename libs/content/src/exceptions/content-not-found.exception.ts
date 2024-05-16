import { HttpException, HttpStatus } from '@nestjs/common';

export class ContentNotFoundException extends HttpException {
  constructor(id: string) {
    const errorMessage = `Content with ID ${id} was not found.`;
    super(errorMessage, HttpStatus.NOT_FOUND);
  }
}
