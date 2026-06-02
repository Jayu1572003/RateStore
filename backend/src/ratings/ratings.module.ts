import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rating } from './rating.entity';
import { Store } from '../stores/store.entity';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Rating, Store])],
  providers: [RatingsService],
  controllers: [RatingsController],
  exports: [RatingsService, TypeOrmModule],
})
export class RatingsModule {}
