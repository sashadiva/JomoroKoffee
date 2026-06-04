import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import axios, { isAxiosError } from 'axios';
import { PrismaService } from '../prisma.service';

interface ProductDetails {
  id: number;
  name: string;
  price: number;
  stock: number;
}

@Injectable()
export class CartService {
  private readonly productServiceUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002';

  constructor(private readonly prisma: PrismaService) {}

  async getCart(userId: number) {
    const cart = await this.prisma.carts.findFirst({
      where: { user_id: userId },
      include: { cart_items: true },
    });

    if (!cart || cart.cart_items.length === 0) {
      return { cartId: null, items: [], totalItems: 0, totalAmount: 0 };
    }

    const items = await Promise.all(
      cart.cart_items.map(async (item) => {
        const product = await this.fetchProduct(item.product_id);
        return {
          productId: item.product_id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          totalPrice: product.price * item.quantity,
        };
      }),
    );

    return {
      cartId: cart.id,
      items,
      totalItems: items.length,
      totalAmount: items.reduce((sum, item) => sum + item.totalPrice, 0),
    };
  }

  async addItem(userId: number, productId: number, quantity: number) {
    const product = await this.fetchProduct(productId);

    if (quantity > product.stock) {
      throw new BadRequestException('Requested quantity must not exceed product stock availability');
    }

    const cart = await this.getOrCreateCart(userId);
    const existingItem = cart.cart_items.find((item) => item.product_id === productId);

    if (existingItem) {
      throw new BadRequestException('Product already exists in the cart');
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

  async updateItem(userId: number, productId: number, quantity: number) {
    const product = await this.fetchProduct(productId);

    if (quantity > product.stock) {
      throw new BadRequestException('Requested quantity must not exceed product stock availability');
    }

    const cart = await this.getExistingCart(userId);
    const cartItem = await this.prisma.cart_items.findFirst({
      where: { cart_id: cart.id, product_id: productId },
    });

    if (!cartItem) {
      throw new NotFoundException('Product not found in cart');
    }

    await this.prisma.cart_items.update({
      where: { id: cartItem.id },
      data: { quantity },
    });

    return { message: 'Cart item quantity updated successfully' };
  }

  async deleteItem(userId: number, productId: number) {
    const cart = await this.getExistingCart(userId);
    const cartItem = await this.prisma.cart_items.findFirst({
      where: { cart_id: cart.id, product_id: productId },
    });

    if (!cartItem) {
      throw new NotFoundException('Product not found in cart');
    }

    await this.prisma.cart_items.delete({ where: { id: cartItem.id } });

    return { message: 'Item removed from cart successfully' };
  }

  async clearCart(userId: number) {
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

  private async getOrCreateCart(userId: number) {
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

  private async getExistingCart(userId: number) {
    const cart = await this.prisma.carts.findFirst({
      where: { user_id: userId },
    });

    if (!cart) {
      throw new NotFoundException('Active cart not found for user');
    }

    return cart;
  }

  private async fetchProduct(productId: number): Promise<ProductDetails> {
    try {
      const response = await axios.get<ProductDetails>(`${this.productServiceUrl}/products/${productId}`);
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        throw new NotFoundException('Product not found');
      }
      throw new BadGatewayException('Unable to retrieve product details from Product Service');
    }
  }
}
