import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsFutureDate implements ValidatorConstraintInterface {
  validate(date: Date) {
    const now = new Date();
    return date.getTime() > now.getTime();
  }

  defaultMessage() {
    return 'The date must be in the future.';
  }
}
