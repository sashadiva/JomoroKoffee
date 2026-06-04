import { Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrderService } from './order.service';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  getOrders(@Req() req: any) {
    return this.orderService.getOrders(req.user.userId);
  }

  @Post()
  checkout(@Req() req: any) {
    return this.orderService.checkout(req.user.userId);
  }

  @Post(':id')
  getOrderDetail(@Req() req: any, @Param('id', ParseIntPipe) orderId: number) {
    return this.orderService.getOrderDetail(req.user.userId, orderId);
  }
}
