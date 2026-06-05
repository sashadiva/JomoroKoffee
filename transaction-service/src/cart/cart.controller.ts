import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('cart')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOkResponse({ description: 'Cart data retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid JWT session token.' })
  getCart(@Req() req: any) {
    return this.cartService.getCart(req.user.id);
  }

  @Post()
  @ApiOkResponse({description: 'Item added to cart successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request - Requested quantity exceeds stock or item already exists.' })
  @ApiResponse({ status: 401, description: 'Unauthorized token context.' })
  addItem(@Req() req: any, @Body() body: AddCartItemDto) {
    return this.cartService.addItem(req.user.id, body.productId, body.quantity);
  }

  @Post(':productId/update')
  @ApiOkResponse({ description: 'Cart item quantity updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request - Quantity exceeds available stock.' })
  @ApiResponse({ status: 404, description: 'Not Found - Targeted product is not present in user\'s cart.' })
  updateCartItem(
    @Req() req: any,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() body: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(req.user.id, productId, body.quantity);
  }

  @Post(':productId/delete')
  @ApiOkResponse({ description: 'Item removed from cart successfully.' })
  @ApiResponse({ status: 404, description: 'Not Found - Targeted product is not present in user\'s cart.' })
  deleteCartItem(@Req() req: any, @Param('productId', ParseIntPipe) productId: number) {
    return this.cartService.deleteItem(req.user.id, productId);
  }

  @Post('clear')
  @ApiOkResponse({ description: 'Cart cleared successfully.' })
  clearCart(@Req() req: any) {
    return this.cartService.clearCart(req.user.id);
  }
}