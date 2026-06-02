import { Module } from '@nestjs/common';
import { ProductCatalogController } from './product-catalog.controller';
import { ProductManagementController } from './product-management.controller';
import { ProductService } from './product.service';
import { AdminGuard } from './admin.guard';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProductCatalogController, ProductManagementController],
  providers: [ProductService, AdminGuard],
})
export class ProductModule {}
