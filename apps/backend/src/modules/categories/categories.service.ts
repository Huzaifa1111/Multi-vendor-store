import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { AdminService } from '../admin/admin.service';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
        private adminService: AdminService,
    ) { }

    async findAll() {
        return this.categoryRepository.find({
            relations: ['products'],
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: number) {
        const category = await this.categoryRepository.findOne({
            where: { id },
            relations: ['products'],
        });

        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        return category;
    }

    async create(createCategoryDto: any) {
        const category = this.categoryRepository.create(createCategoryDto);
        const savedCategory = await this.categoryRepository.save(category);

        // Notify analytics update (categories changed)
        this.adminService.notifyAnalyticsUpdate();

        return savedCategory;
    }

    async update(id: number, updateCategoryDto: any) {
        const category = await this.findOne(id);
        Object.assign(category, updateCategoryDto);
        const updated = await this.categoryRepository.save(category);

        this.adminService.notifyAnalyticsUpdate();

        return updated;
    }

    async remove(id: number) {
        const category = await this.findOne(id);
        await this.categoryRepository.remove(category);

        this.adminService.notifyAnalyticsUpdate();

        return { message: 'Category deleted successfully' };
    }
}
