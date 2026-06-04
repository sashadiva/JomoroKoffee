import { PrismaService } from '../prisma.service';
export declare class CartService {
    private readonly prisma;
    private readonly productServiceUrl;
    constructor(prisma: PrismaService);
    getCart(userId: number): Promise<{
        cartId: null;
        items: never[];
        totalItems: number;
        totalAmount: number;
    } | {
        cartId: number;
        items: {
            productId: number;
            name: string;
            price: number;
            quantity: number;
            totalPrice: number;
        }[];
        totalItems: number;
        totalAmount: number;
    }>;
    addItem(userId: number, productId: number, quantity: number): Promise<{
        message: string;
    }>;
    updateItem(userId: number, productId: number, quantity: number): Promise<{
        message: string;
    }>;
    deleteItem(userId: number, productId: number): Promise<{
        message: string;
    }>;
    clearCart(userId: number): Promise<{
        message: string;
    }>;
    private getOrCreateCart;
    private getExistingCart;
    private fetchProduct;
}
