import { HttpException, HttpStatus } from '@nestjs/common';

export class DeletionFailedException extends HttpException {
  constructor(id: string) {
    const errorMessage = `Deletion of item with id ${id} failed.`;
    super(errorMessage, HttpStatus.GONE);
  }
}
