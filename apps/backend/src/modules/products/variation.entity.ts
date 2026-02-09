import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Product } from './product.entity';
import { AttributeValue } from './attribute.entity';

@Entity('product_variations')
export class ProductVariation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    sku: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    salePrice: number;

    @Column({ type: 'timestamp', nullable: true })
    saleStartDate: Date;

    @Column({ type: 'timestamp', nullable: true })
    saleEndDate: Date;

    @Column({ default: 0 })
    stock: number;

    @Column({ default: true })
    inStock: boolean;

    @Column('simple-array', { nullable: true })
    images: string[];

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    weight: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    length: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    width: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    height: number;

    @Column({ default: false })
    isDefault: boolean;

    @ManyToOne(() => Product, (product) => product.variations, { onDelete: 'CASCADE' })
    product: Product;

    @ManyToMany(() => AttributeValue)
    @JoinTable({
        name: 'variation_attribute_values',
        joinColumn: { name: 'variation_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'attribute_value_id', referencedColumnName: 'id' }
    })
    attributeValues: AttributeValue[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
