import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ProductCatalogController } from './product-catalog.controller';
import { ProductManagementController } from './product-management.controller';
import { ProductService } from './product.service';
import { AdminGuard } from './admin.guard';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ProductCatalogController, ProductManagementController],
  providers: [ProductService, AdminGuard],
})
export class ProductModule {}
