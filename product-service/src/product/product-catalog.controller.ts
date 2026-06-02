import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';

@ApiTags('products')
@Controller() // Leaves the root empty so routes match the spec exactly
export class ProductCatalogController {
  constructor(private readonly productService: ProductService) {}

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