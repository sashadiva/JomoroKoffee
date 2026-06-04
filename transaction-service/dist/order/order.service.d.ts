import { PrismaService } from '../prisma.service';
export declare class OrderService {
    private readonly prisma;
    private readonly productServiceUrl;
    private readonly productServiceAdminToken;
    constructor(prisma: PrismaService);
    getOrders(userId: number): Promise<{
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        items: {
            productId: number;
            quantity: number;
            price: number;
        }[];
    }[]>;
    checkout(userId: number): Promise<{
        message: string;
        orderId: number;
    }>;
    getOrderDetail(userId: number, orderId: number): Promise<{
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        items: {
            productId: number;
            name: string;
            quantity: number;
            price: number;
        }[];
    }>;
    private reduceProductStock;
    private fetchProduct;
}
