import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('cart')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Req() req: any) {
    return this.cartService.getCart(req.user.id);
  }

  @Post()
  addItem(@Req() req: any, @Body() body: AddCartItemDto) {
    return this.cartService.addItem(req.user.id, body.productId, body.quantity);
  }

  @Post(':productId/update')
  updateCartItem(
    @Req() req: any,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() body: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(req.user.id, productId, body.quantity);
  }

  @Post(':productId/delete')
  deleteCartItem(@Req() req: any, @Param('productId', ParseIntPipe) productId: number) {
    return this.cartService.deleteItem(req.user.id, productId);
  }

  @Post('clear')
  clearCart(@Req() req: any) {
    return this.cartService.clearCart(req.user.id);
  }
}
