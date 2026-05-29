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
exports.RegisterDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
let AllowedEmailDomainConstraint = class AllowedEmailDomainConstraint {
    validate(value, args) {
        if (typeof value !== 'string') {
            return false;
        }
        const parts = value.split('@');
        if (parts.length !== 2) {
            return false;
        }
        const domain = parts[1].toLowerCase();
        const allowedDomains = args.constraints[0] || ['com', 'net', 'org', 'id'];
        return allowedDomains.some((allowed) => domain.endsWith(`.${allowed}`));
    }
    defaultMessage(args) {
        const allowedDomains = args.constraints[0] || ['com', 'net', 'org', 'id'];
        return `Email must end with a valid domain (.${allowedDomains.join(', .')})`;
    }
};
AllowedEmailDomainConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'allowedEmailDomain', async: false })
], AllowedEmailDomainConstraint);
function AllowedEmailDomain(domains, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [domains],
            validator: AllowedEmailDomainConstraint,
        });
    };
}
let NoSpacesConstraint = class NoSpacesConstraint {
    validate(value) {
        return typeof value === 'string' && !value.includes(' ');
    }
    defaultMessage() {
        return 'Password cannot contain spaces';
    }
};
NoSpacesConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'noSpaces', async: false })
], NoSpacesConstraint);
function NoSpaces(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: NoSpacesConstraint,
        });
    };
}
let MinDigitsConstraint = class MinDigitsConstraint {
    validate(value, args) {
        if (typeof value !== 'string') {
            return false;
        }
        const minDigits = args.constraints[0];
        let digitCount = 0;
        for (const char of value) {
            if (char >= '0' && char <= '9') {
                digitCount += 1;
            }
        }
        return digitCount >= minDigits;
    }
    defaultMessage(args) {
        const minDigits = args.constraints[0];
        return `Password must contain at least ${minDigits} numeric digits`;
    }
};
MinDigitsConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'minDigits', async: false })
], MinDigitsConstraint);
function MinDigits(min, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [min],
            validator: MinDigitsConstraint,
        });
    };
}
class RegisterDto {
    first_name;
    last_name;
    email;
    password;
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsAlpha)('en-US', { message: 'First name must contain letters only' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "first_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Doe' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsAlpha)('en-US', { message: 'Last name must contain letters only' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "last_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'john@example.com' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)({}, { message: 'Email must be valid' }),
    AllowedEmailDomain(['com', 'net', 'org', 'id'], {
        message: 'Email must end with a valid domain (.com, .net, .org, .id)',
    }),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'abc12345' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(8, { message: 'Password must be at least 8 characters long' }),
    NoSpaces({ message: 'Password cannot contain spaces' }),
    MinDigits(2, { message: 'Password must contain at least 2 numeric digits' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
//# sourceMappingURL=register.dto.js.map