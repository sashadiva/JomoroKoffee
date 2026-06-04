import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(req: any): Promise<{
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
    addItem(req: any, body: AddCartItemDto): Promise<{
        message: string;
    }>;
    updateCartItem(req: any, productId: number, body: UpdateCartItemDto): Promise<{
        message: string;
    }>;
    deleteCartItem(req: any, productId: number): Promise<{
        message: string;
    }>;
    clearCart(req: any): Promise<{
        message: string;
    }>;
}
