"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importStar(require("axios"));
const prisma_service_1 = require("../prisma.service");
let CartService = class CartService {
    prisma;
    productServiceUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002';
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCart(userId) {
        const cart = await this.prisma.carts.findFirst({
            where: { user_id: userId },
            include: { cart_items: true },
        });
        if (!cart || cart.cart_items.length === 0) {
            return { cartId: null, items: [], totalItems: 0, totalAmount: 0 };
        }
        const items = await Promise.all(cart.cart_items.map(async (item) => {
            const product = await this.fetchProduct(item.product_id);
            return {
                productId: item.product_id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                totalPrice: product.price * item.quantity,
            };
        }));
        return {
            cartId: cart.id,
            items,
            totalItems: items.length,
            totalAmount: items.reduce((sum, item) => sum + item.totalPrice, 0),
        };
    }
    async addItem(userId, productId, quantity) {
        const product = await this.fetchProduct(productId);
        if (quantity > product.stock) {
            throw new common_1.BadRequestException('Requested quantity must not exceed product stock availability');
        }
        const cart = await this.getOrCreateCart(userId);
        const existingItem = cart.cart_items.find((item) => item.product_id === productId);
        if (existingItem) {
            throw new common_1.BadRequestException('Product already exists in the cart');
        }
        await this.prisma.cart_items.create({
            data: {
                cart_id: cart.id,
                product_id: productId,
                quantity,
            },
        });
        return { message: 'Item added to cart successfully' };
    }
    async updateItem(userId, productId, quantity) {
        const product = await this.fetchProduct(productId);
        if (quantity > product.stock) {
            throw new common_1.BadRequestException('Requested quantity must not exceed product stock availability');
        }
        const cart = await this.getExistingCart(userId);
        const cartItem = await this.prisma.cart_items.findFirst({
            where: { cart_id: cart.id, product_id: productId },
        });
        if (!cartItem) {
            throw new common_1.NotFoundException('Product not found in cart');
        }
        await this.prisma.cart_items.update({
            where: { id: cartItem.id },
            data: { quantity },
        });
        return { message: 'Cart item quantity updated successfully' };
    }
    async deleteItem(userId, productId) {
        const cart = await this.getExistingCart(userId);
        const cartItem = await this.prisma.cart_items.findFirst({
            where: { cart_id: cart.id, product_id: productId },
        });
        if (!cartItem) {
            throw new common_1.NotFoundException('Product not found in cart');
        }
        await this.prisma.cart_items.delete({ where: { id: cartItem.id } });
        return { message: 'Item removed from cart successfully' };
    }
    async clearCart(userId) {
        const cart = await this.prisma.carts.findFirst({
            where: { user_id: userId },
        });
        if (!cart) {
            return { message: 'Cart cleared successfully' };
        }
        await this.prisma.cart_items.deleteMany({
            where: { cart_id: cart.id },
        });
        return { message: 'Cart cleared successfully' };
    }
    async getOrCreateCart(userId) {
        const existingCart = await this.prisma.carts.findFirst({
            where: { user_id: userId },
            include: { cart_items: true },
        });
        if (existingCart) {
            return existingCart;
        }
        return this.prisma.carts.create({
            data: { user_id: userId },
            include: { cart_items: true },
        });
    }
    async getExistingCart(userId) {
        const cart = await this.prisma.carts.findFirst({
            where: { user_id: userId },
        });
        if (!cart) {
            throw new common_1.NotFoundException('Active cart not found for user');
        }
        return cart;
    }
    async fetchProduct(productId) {
        try {
            const response = await axios_1.default.get(`${this.productServiceUrl}/products/${productId}`);
            return response.data;
        }
        catch (error) {
            if ((0, axios_1.isAxiosError)(error) && error.response?.status === 404) {
                throw new common_1.NotFoundException('Product not found');
            }
            throw new common_1.BadGatewayException('Unable to retrieve product details from Product Service');
        }
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map