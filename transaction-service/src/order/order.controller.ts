import { Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrderService } from './order.service';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('order')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard)
@Controller('orders')

@ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid JWT session token' })
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @ApiOkResponse({ description: 'Order history list retrieved successfully.' }) 
  getOrders(@Req() req: any) {
    return this.orderService.getOrders(req.user.id);
  }

  @Post()
  @ApiCreatedResponse({ description: 'Order checked out and processed successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request - The shopping cart is empty or requested quantities exceed available stock.' })
  checkout(@Req() req: any) {
    return this.orderService.checkout(req.user.id);
  }

  @Post(':id')
  @ApiOkResponse({ description: 'Specific order invoice item details compiled successfully.' }) 
  @ApiResponse({ status: 404, description: 'Not Found - No matching order matching this ID was found for the current user session.' })
  getOrderDetail(@Req() req: any, @Param('id', ParseIntPipe) orderId: number) {
    return this.orderService.getOrderDetail(req.user.id, orderId);
  }
}