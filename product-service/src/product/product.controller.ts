import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { AdminGuard } from './admin.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { ReduceProductDto } from './dto/reduce-product.dto';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(AdminGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('products')
  @ApiOkResponse({ description: 'Create a new product' })
  createProduct(@Body() dto: CreateProductDto) {
    return this.productService.createProduct(dto);
  }

  @Post('products/:id/update')
  @ApiOkResponse({ description: 'Update product details' })
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateProductDto,
  ) {
    return this.productService.updateProduct(id, dto);
  }

  @Post('products/:id/reduce')
  @ApiOkResponse({ description: 'Reduce product stock quantity' })
  reduceProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ReduceProductDto,
  ) {
    return this.productService.reduceProduct(id, dto.quantity);
  }

  @Post('products/:id/delete')
  @ApiOkResponse({ description: 'Delete a product' })
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productService.deleteProduct(id);
  }

  @Get('products')
  @ApiOkResponse({ description: 'List all products' })
  getProducts() {
    return this.productService.getProducts();
  }

  @Get('products/:id')
  @ApiOkResponse({ description: 'Get product details by ID' })
  getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productService.getProductById(id);
  }

  @Get('categories')
  @ApiOkResponse({ description: 'List all categories' })
  getCategories() {
    return this.productService.getCategories();
  }

  @Get('categories/:categoryId/products')
  @ApiOkResponse({ description: 'List products within a category' })
  getProductsByCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.productService.getProductsByCategory(categoryId);
  }
}
