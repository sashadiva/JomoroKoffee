"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProductDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
let MinWordsConstraint = class MinWordsConstraint {
    validate(value, args) {
        if (typeof value !== 'string') {
            return false;
        }
        const words = value.trim().split(/\s+/).filter(Boolean);
        return words.length >= args.constraints[0];
    }
    defaultMessage(args) {
        const count = args.constraints[0];
        return `Product name must contain at least ${count} words`;
    }
};
MinWordsConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'minWords', async: false })
], MinWordsConstraint);
function MinWords(minWords, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [minWords],
            validator: MinWordsConstraint,
        });
    };
}
class CreateProductDto {
    name;
    description;
    price;
    stock;
    image_url;
    category_id;
}
exports.CreateProductDto = CreateProductDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Kopi Susu Khas Jomoro' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    MinWords(3, { message: 'Product name must contain at least 3 words' }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Delicious milk coffee with a rich aroma from local beans.' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(20, { message: 'Product description must have at least 20 characters' }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12000 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: 'Price must be an integer' }),
    (0, class_validator_1.Min)(1, { message: 'Price must be at least 1' }),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: 'Stock must be an integer' }),
    (0, class_validator_1.Min)(0, { message: 'Product stock must be between 0 and 999' }),
    (0, class_validator_1.Max)(999, { message: 'Product stock must be between 0 and 999' }),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "stock", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://example.com/image.png', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateProductDto.prototype, "image_url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: 'Category ID must be an integer' }),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "category_id", void 0);
//# sourceMappingURL=create-product.dto.js.map