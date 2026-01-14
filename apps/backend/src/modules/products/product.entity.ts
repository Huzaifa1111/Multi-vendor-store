import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2, transformer: {
    // Add transformer to handle decimal to number conversion
    from: (value: string) => parseFloat(value),
    to: (value: number) => value,
  }})
  price: number;

  @Column({ nullable: true })
  image: string;

  @Column()
  category: string;

  @Column({ default: 0 })
  stock: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}