import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Review } from '../reviews/review.entity';
import { Brand } from '../brands/brand.entity';
import { ProductVariation } from './variation.entity';
import { Category } from '../categories/category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: 0 }) // Add default value
  stock: number;

  @Column('simple-array', { nullable: true })
  images: string[];

  @ManyToOne(() => Category, (category) => category.products, { nullable: true, onDelete: 'SET NULL' })
  category: Category;

  @Column({ default: false })
  featured: boolean;

  @Column({ nullable: true })
  sku: string;

  @Column('text', { nullable: true })
  longDescription: string;

  @Column('text', { nullable: true })
  shippingPolicy: string;

  @Column('text', { nullable: true })
  returnPolicy: string;

  @Column('simple-array', { nullable: true })
  descriptionImages: string[];

  @ManyToOne(() => Brand, (brand) => brand.products, { nullable: true })
  brand: Brand;

  @OneToMany(() => ProductVariation, (variation) => variation.product, { cascade: true })
  variations: ProductVariation[];

  @ManyToMany(() => Product)
  @JoinTable({
    name: 'product_upsells',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'upsell_id', referencedColumnName: 'id' }
  })
  upsells: Product[];

  @ManyToMany(() => Product)
  @JoinTable({
    name: 'product_cross_sells',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'cross_sell_id', referencedColumnName: 'id' }
  })
  crossSells: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];
}