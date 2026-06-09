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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductManagementController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const product_service_1 = require("./product.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const admin_guard_1 = require("./admin.guard");
const create_product_dto_1 = require("./dto/create-product.dto");
const reduce_product_dto_1 = require("./dto/reduce-product.dto");
let ProductManagementController = class ProductManagementController {
    productService;
    constructor(productService) {
        this.productService = productService;
    }
    createProduct(dto) {
        return this.productService.createProduct(dto);
    }
    updateProduct(id, dto) {
        return this.productService.updateProduct(id, dto);
    }
    reduceProduct(id, dto) {
        return this.productService.reduceProduct(id, dto.quantity);
    }
    deleteProduct(id) {
        return this.productService.deleteProduct(id);
    }
};
exports.ProductManagementController = ProductManagementController;
__decorate([
    (0, common_1.Post)('products'),
    (0, swagger_1.ApiOkResponse)({ description: 'Create a new product' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", void 0)
], ProductManagementController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Post)('products/:id/update'),
    (0, swagger_1.ApiOkResponse)({ description: 'Update product details' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", void 0)
], ProductManagementController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Post)('products/:id/reduce'),
    (0, swagger_1.ApiOkResponse)({ description: 'Reduce product stock quantity' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, reduce_product_dto_1.ReduceProductDto]),
    __metadata("design:returntype", void 0)
], ProductManagementController.prototype, "reduceProduct", null);
__decorate([
    (0, common_1.Post)('products/:id/delete'),
    (0, swagger_1.ApiOkResponse)({ description: 'Delete a product' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProductManagementController.prototype, "deleteProduct", null);
exports.ProductManagementController = ProductManagementController = __decorate([
    (0, swagger_1.ApiTags)('admin'),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], ProductManagementController);
//# sourceMappingURL=product-management.controller.js.map