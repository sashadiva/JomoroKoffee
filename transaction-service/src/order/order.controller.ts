import { Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrderService } from './order.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('order')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  getOrders(@Req() req: any) {
    return this.orderService.getOrders(req.user.id);
  }

  @Post()
  checkout(@Req() req: any) {
    return this.orderService.checkout(req.user.id);
  }

  @Post(':id')
  getOrderDetail(@Req() req: any, @Param('id', ParseIntPipe) orderId: number) {
    return this.orderService.getOrderDetail(req.user.id, orderId);
  }
}
