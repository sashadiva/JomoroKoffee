import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  getProducts() {
    return this.prisma.products.findMany({
      include: {
        category: true,
      },
    });
  }

  async getProductById(id: number) {
    const product = await this.prisma.products.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  getCategories() {
    return this.prisma.categories.findMany();
  }

  getProductsByCategory(categoryId: number) {
    return this.prisma.products.findMany({
      where: { category_id: categoryId },
      include: {
        category: true,
      },
    });
  }

  async createProduct(dto: CreateProductDto) {
    await this.ensureCategoryExists(dto.category_id);

    await this.prisma.products.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        stock: dto.stock,
        image_url: dto.image_url ?? null,
        category_id: dto.category_id,
      },
    });

    return { message: 'Product created successfully' };
  }

  async updateProduct(id: number, dto: CreateProductDto) {
    await this.ensureProductExists(id);
    await this.ensureCategoryExists(dto.category_id);

    await this.prisma.products.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        stock: dto.stock,
        image_url: dto.image_url ?? null,
        category_id: dto.category_id,
      },
    });

    return { message: 'Product updated successfully' };
  }

  async reduceProduct(id: number, quantity: number) {
    const product = await this.ensureProductExists(id);

    if (quantity > product.stock) {
      throw new BadRequestException('Quantity exceeds available stock');
    }

    await this.prisma.products.update({
      where: { id },
      data: {
        stock: product.stock - quantity,
      },
    });

    return { message: 'Product stock reduced successfully' };
  }

  async deleteProduct(id: number) {
    await this.ensureProductExists(id);

    await this.prisma.products.delete({
      where: { id },
    });

    return { message: 'Product deleted successfully' };
  }

  private async ensureCategoryExists(categoryId: number) {
    const category = await this.prisma.categories.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new BadRequestException('Category does not exist');
    }

    return category;
  }

  private async ensureProductExists(id: number) {
    const product = await this.prisma.products.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }
}
