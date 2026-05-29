import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
  MinLength,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Type } from 'class-transformer';

@ValidatorConstraint({ name: 'minWords', async: false })
class MinWordsConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (typeof value !== 'string') {
      return false;
    }

    const words = value.trim().split(/\s+/).filter(Boolean);
    return words.length >= (args.constraints[0] as number);
  }

  defaultMessage(args: ValidationArguments) {
    const count = args.constraints[0] as number;
    return `Product name must contain at least ${count} words`;
  }
}

function MinWords(minWords: number, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [minWords],
      validator: MinWordsConstraint,
    });
  };
}

export class CreateProductDto {
  @ApiProperty({ example: 'Kopi Susu Khas Jomoro' })
  @IsNotEmpty()
  @IsString()
  @MinWords(3, { message: 'Product name must contain at least 3 words' })
  name!: string;

  @ApiProperty({ example: 'Delicious milk coffee with a rich aroma from local beans.' })
  @IsNotEmpty()
  @IsString()
  @MinLength(20, { message: 'Product description must have at least 20 characters' })
  description!: string;

  @ApiProperty({ example: 12000 })
  @Type(() => Number)
  @IsInt({ message: 'Price must be an integer' })
  @Min(1, { message: 'Price must be at least 1' })
  price!: number;

  @ApiProperty({ example: 50 })
  @Type(() => Number)
  @IsInt({ message: 'Stock must be an integer' })
  @Min(0, { message: 'Product stock must be between 0 and 999' })
  @Max(999, { message: 'Product stock must be between 0 and 999' })
  stock!: number;

  @ApiPropertyOptional({ example: 'https://example.com/image.png', nullable: true })
  @IsOptional()
  @IsString()
  image_url?: string | null;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt({ message: 'Category ID must be an integer' })
  category_id!: number;
}
