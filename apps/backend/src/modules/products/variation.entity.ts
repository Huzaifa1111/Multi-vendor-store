import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_variations')
export class ProductVariation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    color: string;

    @Column({ nullable: true })
    size: string;

    @Column({ unique: true })
    sku: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column({ default: 0 })
    stock: number;

    @ManyToOne(() => Product, (product) => product.variations, { onDelete: 'CASCADE' })
    product: Product;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
