import { BadGatewayException, BadRequestException, NotFoundException, Injectable } from '@nestjs/common';
import axios, { isAxiosError } from 'axios';
import { PrismaService } from '../prisma.service';

interface ProductDetails {
  id: number;
  name: string;
  price: number;
  stock?: number;
}

@Injectable()
export class OrderService {
  private readonly productServiceUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002';
  private readonly productServiceAdminToken = process.env.PRODUCT_SERVICE_ADMIN_TOKEN;

  constructor(private readonly prisma: PrismaService) {}

  async getOrders(userId: number) {
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

  async checkout(userId: number) {
    const cart = await this.prisma.carts.findFirst({
      where: { user_id: userId },
      include: { cart_items: true },
    });

    if (!cart || cart.cart_items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const orderItems = await Promise.all(
      cart.cart_items.map(async (item) => {
        const product = await this.fetchProduct(item.product_id);

        if (item.quantity > (product.stock ?? 0)) {
          throw new BadRequestException(`Requested quantity exceeds available stock for product ID ${item.product_id}`);
        }

        return {
          productId: item.product_id,
          price: product.price,
          quantity: item.quantity,
        };
      }),
    );

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

    await this.prisma.cart_items.deleteMany({
      where: { cart_id: cart.id },
    });

    await Promise.all(
      orderItems.map(async (item) => this.reduceProductStock(item.productId, item.quantity)),
    );

    return { message: 'Order processed successfully', orderId: order.id };
  }

  async getOrderDetail(userId: number, orderId: number) {
    const order = await this.prisma.orders.findFirst({
      where: { id: orderId, user_id: userId },
      include: { order_details: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const items = await Promise.all(
      order.order_details.map(async (detail) => {
        const product = await this.fetchProduct(detail.product_id);
        return {
          productId: detail.product_id,
          name: product.name,
          quantity: detail.quantity,
          price: detail.price,
        };
      }),
    );

    return {
      id: order.id,
      userId: order.user_id,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      items,
    };
  }

  private async reduceProductStock(productId: number, quantity: number) {
    try {
      await axios.post(
        `${this.productServiceUrl}/admin/products/${productId}/reduce`,
        { quantity },
        {
          headers: this.productServiceAdminToken
            ? { Authorization: `Bearer ${this.productServiceAdminToken}` }
            : {},
        },
      );
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        throw new NotFoundException(`Product ${productId} not found when reducing stock`);
      }
      throw new BadGatewayException('Unable to update product stock via Product Service');
    }
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
