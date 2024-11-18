import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { validate } from 'uuid';

@ValidatorConstraint({ name: 'IsUUID', async: false })
@Injectable()
export class IsUUID implements ValidatorConstraintInterface {
  validate(id: string) {
    return validate(id);
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must have UUID format.`;
  }
}
