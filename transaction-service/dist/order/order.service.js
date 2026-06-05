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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importStar(require("axios"));
const prisma_service_1 = require("../prisma.service");
let OrderService = class OrderService {
    prisma;
    productServiceUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002';
    productServiceAdminToken = process.env.PRODUCT_SERVICE_ADMIN_TOKEN;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOrders(userId) {
        const orders = await this.prisma.orders.findMany({
            where: { user_id: userId },
            include: { order_details: true },
            orderBy: { created_at: 'desc' },
        });
        return orders.map((order) => ({
            id: order.id,
            userId: order.user_id,
            createdAt: order.created_at,
            updatedAt: order.updated_at,
            items: order.order_details.map((detail) => ({
                productId: detail.product_id,
                quantity: detail.quantity,
                price: detail.price,
            })),
        }));
    }
    async checkout(userId) {
        const cart = await this.prisma.carts.findFirst({
            where: { user_id: userId },
            include: { cart_items: true },
        });
        if (!cart || cart.cart_items.length === 0) {
            throw new common_1.BadRequestException('Cart is empty');
        }
        const orderItems = await Promise.all(cart.cart_items.map(async (item) => {
            const product = await this.fetchProduct(item.product_id);
            if (item.quantity > (product.stock ?? 0)) {
                throw new common_1.BadRequestException(`Requested quantity exceeds available stock for product ID ${item.product_id}`);
            }
            return {
                productId: item.product_id,
                price: product.price,
                quantity: item.quantity,
            };
        }));
        const order = await this.prisma.orders.create({
            data: {
                user_id: userId,
                created_at: new Date(),
                updated_at: new Date(),
                order_details: {
                    create: orderItems.map((item) => ({
                        product_id: item.productId,
                        price: item.price,
                        quantity: item.quantity,
                    })),
                },
            },
            include: { order_details: true },
        });
        await Promise.all(orderItems.map(async (item) => this.reduceProductStock(item.productId, item.quantity)));
        await this.prisma.cart_items.deleteMany({
            where: { cart_id: cart.id },
        });
        return { message: 'Order processed successfully', orderId: order.id };
    }
    async getOrderDetail(userId, orderId) {
        const order = await this.prisma.orders.findFirst({
            where: { id: orderId, user_id: userId },
            include: { order_details: true },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        const items = await Promise.all(order.order_details.map(async (detail) => {
            const product = await this.fetchProduct(detail.product_id);
            return {
                productId: detail.product_id,
                name: product.name,
                quantity: detail.quantity,
                price: detail.price,
            };
        }));
        return {
            id: order.id,
            userId: order.user_id,
            createdAt: order.created_at,
            updatedAt: order.updated_at,
            items,
        };
    }
    async reduceProductStock(productId, quantity) {
        try {
            await axios_1.default.post(`${this.productServiceUrl}/admin/products/${productId}/reduce`, { quantity }, {
                headers: this.productServiceAdminToken
                    ? { Authorization: `Bearer ${this.productServiceAdminToken}` }
                    : {},
            });
        }
        catch (error) {
            if ((0, axios_1.isAxiosError)(error) && error.response?.status === 404) {
                throw new common_1.NotFoundException(`Product ${productId} not found when reducing stock`);
            }
            throw new common_1.BadGatewayException('Unable to update product stock via Product Service');
        }
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
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrderService);
//# sourceMappingURL=order.service.js.map