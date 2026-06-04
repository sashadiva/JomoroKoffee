import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { ProfileModule } from './profile/profile.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule, AuthModule, CartModule, OrderModule, ProfileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
