import { HttpException, HttpStatus } from '@nestjs/common';

export class UnexpectedErrorException extends HttpException {
  constructor() {
    const errorMessage =
      'An unexpected error occurred. Please try again later. Also, please check if the provided parameters are correct.';
    super(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
