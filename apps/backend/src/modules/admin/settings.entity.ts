import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('settings')
export class Settings {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 'My Awesome Store' })
    storeName: string;

    @Column({ default: 'admin@example.com' })
    storeEmail: string;

    @Column({ default: '+1234567890' })
    storePhone: string;

    @Column({ type: 'text', nullable: true })
    storeAddress: string;

    @Column({ default: 'USD' })
    currency: string;

    @Column({ default: false })
    maintenanceMode: boolean;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    taxRate: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    shippingFee: number;

    @UpdateDateColumn()
    updatedAt: Date;
}
