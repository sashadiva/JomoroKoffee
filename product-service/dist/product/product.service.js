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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let ProductService = class ProductService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    getProducts() {
        return this.prisma.products.findMany({
            include: {
                category: true,
            },
        });
    }
    async getProductById(id) {
        const product = await this.prisma.products.findUnique({
            where: { id },
            include: {
                category: true,
            },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    getCategories() {
        return this.prisma.categories.findMany();
    }
    getProductsByCategory(categoryId) {
        return this.prisma.products.findMany({
            where: { category_id: categoryId },
            include: {
                category: true,
            },
        });
    }
    async createProduct(dto) {
        await this.ensureCategoryExists(dto.category_id);
        await this.prisma.products.create({
            data: {
                name: dto.name,
                description: dto.description,
                price: dto.price,
                stock: dto.stock,
                image_url: dto.image_url ?? null,
                category_id: dto.category_id,
            },
        });
        return { message: 'Product created successfully' };
    }
    async updateProduct(id, dto) {
        await this.ensureProductExists(id);
        await this.ensureCategoryExists(dto.category_id);
        await this.prisma.products.update({
            where: { id },
            data: {
                name: dto.name,
                description: dto.description,
                price: dto.price,
                stock: dto.stock,
                image_url: dto.image_url ?? null,
                category_id: dto.category_id,
            },
        });
        return { message: 'Product updated successfully' };
    }
    async reduceProduct(id, quantity) {
        const product = await this.ensureProductExists(id);
        if (quantity > product.stock) {
            throw new common_1.BadRequestException('Quantity exceeds available stock');
        }
        await this.prisma.products.update({
            where: { id },
            data: {
                stock: product.stock - quantity,
            },
        });
        return { message: 'Product stock reduced successfully' };
    }
    async deleteProduct(id) {
        await this.ensureProductExists(id);
        await this.prisma.products.delete({
            where: { id },
        });
        return { message: 'Product deleted successfully' };
    }
    async ensureCategoryExists(categoryId) {
        const category = await this.prisma.categories.findUnique({
            where: { id: categoryId },
        });
        if (!category) {
            throw new common_1.BadRequestException('Category does not exist');
        }
        return category;
    }
    async ensureProductExists(id) {
        const product = await this.prisma.products.findUnique({
            where: { id },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductService);
//# sourceMappingURL=product.service.js.map