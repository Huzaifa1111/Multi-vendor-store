// apps/backend/src/modules/orders/order-item.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../products/product.entity';

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    orderId: number;

    @Column()
    productId: number;

    @ManyToOne(() => Order, (order) => order.items)
    order: Order;

    @ManyToOne(() => Product)
    product: Product;

    @Column()
    quantity: number;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column({ nullable: true })
    color: string;

    @Column({ nullable: true })
    size: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
