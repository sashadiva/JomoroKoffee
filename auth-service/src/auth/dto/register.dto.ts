import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlpha,
  IsEmail,
  IsNotEmpty,
  MinLength,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'allowedEmailDomain', async: false })
class AllowedEmailDomainConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (typeof value !== 'string') {
      return false;
    }

    const parts = value.split('@');
    if (parts.length !== 2) {
      return false;
    }

    const domain = parts[1].toLowerCase();
    const allowedDomains = (args.constraints[0] as string[]) || ['com', 'net', 'org', 'id'];

    return allowedDomains.some((allowed) => domain.endsWith(`.${allowed}`));
  }

  defaultMessage(args: ValidationArguments) {
    const allowedDomains = (args.constraints[0] as string[]) || ['com', 'net', 'org', 'id'];
    return `Email must end with a valid domain (.${allowedDomains.join(', .')})`;
  }
}

function AllowedEmailDomain(domains: string[], validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [domains],
      validator: AllowedEmailDomainConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'noSpaces', async: false })
class NoSpacesConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    return typeof value === 'string' && !value.includes(' ');
  }

  defaultMessage() {
    return 'Password cannot contain spaces';
  }
}

function NoSpaces(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: NoSpacesConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'minDigits', async: false })
class MinDigitsConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (typeof value !== 'string') {
      return false;
    }

    const minDigits = args.constraints[0] as number;
    let digitCount = 0;

    for (const char of value) {
      if (char >= '0' && char <= '9') {
        digitCount += 1;
      }
    }

    return digitCount >= minDigits;
  }

  defaultMessage(args: ValidationArguments) {
    const minDigits = args.constraints[0] as number;
    return `Password must contain at least ${minDigits} numeric digits`;
  }
}

function MinDigits(min: number, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [min],
      validator: MinDigitsConstraint,
    });
  };
}

export class RegisterDto {
  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @IsAlpha('en-US', { message: 'First name must contain letters only' })
  first_name!: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  @IsAlpha('en-US', { message: 'Last name must contain letters only' })
  last_name!: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Email must be valid' })
  @AllowedEmailDomain(['com', 'net', 'org', 'id'], {
    message: 'Email must end with a valid domain (.com, .net, .org, .id)',
  })
  email!: string;

  @ApiProperty({ example: 'abc12345' })
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @NoSpaces({ message: 'Password cannot contain spaces' })
  @MinDigits(2, { message: 'Password must contain at least 2 numeric digits' })
  password!: string;
}
