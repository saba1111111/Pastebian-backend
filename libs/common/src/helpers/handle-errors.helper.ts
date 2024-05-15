import { HttpException } from '@nestjs/common';
import { UnexpectedErrorException } from '../exceptions';

export function handleError(error: unknown) {
  if (error instanceof HttpException) {
    throw error;
  } else {
    console.error(`### Unhandled error: ${error}. ###`);
    throw new UnexpectedErrorException();
  }
}
