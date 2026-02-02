// apps/backend/src/modules/brands/brands.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './brand.entity';

@Injectable()
export class BrandsService implements OnModuleInit {
    constructor(
        @InjectRepository(Brand)
        private brandRepository: Repository<Brand>,
    ) { }

    async onModuleInit() {
        await this.seed();
    }

    async findAll(): Promise<Brand[]> {
        return this.brandRepository.find({ order: { name: 'ASC' } });
    }

    async seed() {
        const count = await this.brandRepository.count();
        if (count > 0) return;

        const initialBrands = [
            { name: 'Apple', description: 'Tech giant' },
            { name: 'Samsung', description: 'Electronics leader' },
            { name: 'Nike', description: 'Sportswear icon' },
            { name: 'Adidas', description: 'Athletic brand' },
            { name: 'Sony', description: 'Electronics and entertainment' },
            { name: 'HP', description: 'Computing solutions' },
            { name: 'Logitech', description: 'Computer peripherals' },
        ];

        for (const brandData of initialBrands) {
            const brand = this.brandRepository.create(brandData);
            await this.brandRepository.save(brand);
        }
        console.log('Brands seeded successfully');
    }
}
