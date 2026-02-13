import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { OrdersService } from './modules/orders/orders.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const ordersService = app.get(OrdersService);

    console.log('--- DIAGNOSTIC START ---');
    try {
        const orders = await ordersService.getAllOrders();
        console.log(`Total orders found: ${orders.length}`);
        if (orders.length > 0) {
            const first = orders[0];
            console.log(`First order: ID=${first.id}, OrderNumber=${first.orderNumber}`);

            if (first.orderNumber) {
                console.log(`Testing getOrderByOrderNumber for ${first.orderNumber}...`);
                const trackResult = await ordersService.getOrderByOrderNumber(first.orderNumber);
                console.log('SUCCESS: Order tracked successfully');
                console.log('Items count:', trackResult.items?.length);
            } else {
                console.log('First order has no orderNumber!');
            }
        }
    } catch (error) {
        console.error('DIAGNOSTIC ERROR:', error.message);
        console.error(error.stack);
    }
    console.log('--- DIAGNOSTIC END ---');
    await app.close();
}
bootstrap();
