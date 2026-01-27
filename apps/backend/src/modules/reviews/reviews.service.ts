import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>,
    ) { }

    async create(userId: number, createReviewDto: CreateReviewDto): Promise<Review> {
        const review = this.reviewRepository.create({
            ...createReviewDto,
            userId,
        });
        return await this.reviewRepository.save(review);
    }

    async findByProduct(productId: number): Promise<Review[]> {
        return await this.reviewRepository.find({
            where: { productId },
            relations: ['user'],
            order: { createdAt: 'DESC' },
        });
    }

    async findAll(): Promise<Review[]> {
        return await this.reviewRepository.find({
            relations: ['user', 'product'],
            order: { createdAt: 'DESC' },
        });
    }

    async getReviewStats() {
        const count = await this.reviewRepository.count();
        return { count };
    }
}
