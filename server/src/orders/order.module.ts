import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersController } from './controller/orders.controller';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrdersService } from './services/orders.service';
import { StockReservationService } from './services/stock-reservation.service';
import { ProductsModule } from '@/products/products.module';
import { EmailService } from '@/email/services/email.services';
import { User, UserSchema } from '@/users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrderSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    ProductsModule, // This will make the Product model available in the OrdersService
  ],
  controllers: [OrdersController],
  providers: [OrdersService, StockReservationService, EmailService],
  exports: [OrdersService, StockReservationService],
})
export class OrderModule {}
