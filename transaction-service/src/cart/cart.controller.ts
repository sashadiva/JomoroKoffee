import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Req() req: any) {
    return this.cartService.getCart(req.user.userId);
  }

  @Post()
  addItem(@Req() req: any, @Body() body: AddCartItemDto) {
    return this.cartService.addItem(req.user.userId, body.productId, body.quantity);
  }

  @Post(':productId/update')
  updateCartItem(
    @Req() req: any,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() body: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(req.user.userId, productId, body.quantity);
  }

  @Post(':productId/delete')
  deleteCartItem(@Req() req: any, @Param('productId', ParseIntPipe) productId: number) {
    return this.cartService.deleteItem(req.user.userId, productId);
  }

  @Post('clear')
  clearCart(@Req() req: any) {
    return this.cartService.clearCart(req.user.userId);
  }
}
