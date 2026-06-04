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
exports.ProductCatalogController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const product_service_1 = require("./product.service");
let ProductCatalogController = class ProductCatalogController {
    productService;
    constructor(productService) {
        this.productService = productService;
    }
    getProducts() {
        return this.productService.getProducts();
    }
    getProductById(id) {
        return this.productService.getProductById(id);
    }
    getCategories() {
        return this.productService.getCategories();
    }
    getProductsByCategory(categoryId) {
        return this.productService.getProductsByCategory(categoryId);
    }
};
exports.ProductCatalogController = ProductCatalogController;
__decorate([
    (0, common_1.Get)('products'),
    (0, swagger_1.ApiOkResponse)({ description: 'List all products' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductCatalogController.prototype, "getProducts", null);
__decorate([
    (0, common_1.Get)('products/:id'),
    (0, swagger_1.ApiOkResponse)({ description: 'Get product details by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProductCatalogController.prototype, "getProductById", null);
__decorate([
    (0, common_1.Get)('categories'),
    (0, swagger_1.ApiOkResponse)({ description: 'List all categories' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductCatalogController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)('categories/:categoryId/products'),
    (0, swagger_1.ApiOkResponse)({ description: 'List products within a category' }),
    __param(0, (0, common_1.Param)('categoryId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProductCatalogController.prototype, "getProductsByCategory", null);
exports.ProductCatalogController = ProductCatalogController = __decorate([
    (0, swagger_1.ApiTags)('products'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], ProductCatalogController);
//# sourceMappingURL=product-catalog.controller.js.map