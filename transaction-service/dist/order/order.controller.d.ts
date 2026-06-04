import { OrderService } from './order.service';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    getOrders(req: any): Promise<{
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
    checkout(req: any): Promise<{
        message: string;
        orderId: number;
    }>;
    getOrderDetail(req: any, orderId: number): Promise<{
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
}
