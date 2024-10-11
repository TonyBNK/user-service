import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { validate } from 'uuid';

@ValidatorConstraint({ name: 'IsIdUuid', async: false })
@Injectable()
export class IsIdUuidConstraint implements ValidatorConstraintInterface {
  validate(id: string) {
    return validate(id);
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must have UUID format.`;
  }
}
