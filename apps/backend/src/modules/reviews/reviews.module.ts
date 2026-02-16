import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewService } from './reviews.service';
import { ReviewController } from './reviews.controller';
import { Review } from './review.entity';
import { AdminModule } from '../admin/admin.module';

@Module({
    imports: [TypeOrmModule.forFeature([Review]), AdminModule],
    controllers: [ReviewController],
    providers: [ReviewService],
    exports: [ReviewService, TypeOrmModule],
})
export class ReviewsModule { }
