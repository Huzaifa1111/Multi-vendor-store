import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column({
    type: 'varchar',
    default: OrderStatus.PENDING
  })
  status: OrderStatus;

  @Column({ nullable: true })
  shippingAddress: string;

  @Column({ nullable: true })
  paymentMethod: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @UpdateDateColumn()
  updatedAt: Date;
}