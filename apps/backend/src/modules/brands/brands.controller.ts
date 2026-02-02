// apps/backend/src/modules/brands/brands.controller.ts
import { Controller, Get, Post } from '@nestjs/common';
import { BrandsService } from './brands.service';

@Controller('brands')
export class BrandsController {
    constructor(private readonly brandsService: BrandsService) { }

    @Get()
    async findAll() {
        return this.brandsService.findAll();
    }

    @Post('seed')
    async seed() {
        await this.brandsService.seed();
        return { message: 'Brands seeded' };
    }
}
