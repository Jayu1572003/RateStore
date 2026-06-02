import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './rating.entity';
import { Store } from '../stores/store.entity';
import { SubmitRatingDto } from './dto/submit-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>
  ) {}

  async submit(submitRatingDto: SubmitRatingDto, userId: string) {
    const { storeId, value } = submitRatingDto;

    // Check store exists
    const store = await this.storeRepository.findOne({ where: { id: storeId } });
    if (!store) {
      throw new NotFoundException(`Store with ID ${storeId} not found`);
    }

    // Check if user already rated this store
    const existing = await this.ratingRepository.findOne({
      where: { user_id: userId, store_id: storeId },
    });
    if (existing) {
      throw new ConflictException('You have already rated this store');
    }

    const rating = this.ratingRepository.create({
      user_id: userId,
      store_id: storeId,
      value,
    });

    const saved = await this.ratingRepository.save(rating);

    return {
      id: saved.id,
      storeId: saved.store_id,
      userId: saved.user_id,
      value: saved.value,
    };
  }

  async update(storeId: string, updateRatingDto: UpdateRatingDto, userId: string) {
    const rating = await this.ratingRepository.findOne({
      where: { store_id: storeId, user_id: userId },
    });

    if (!rating) {
      // Check if rating exists for this store at all
      const anyRatingForStore = await this.ratingRepository.findOne({
        where: { store_id: storeId },
      });
      if (anyRatingForStore) {
        throw new ForbiddenException('You do not own this rating');
      } else {
        throw new NotFoundException('Rating not found');
      }
    }

    rating.value = updateRatingDto.value;
    const updated = await this.ratingRepository.save(rating);

    return {
      id: updated.id,
      storeId: updated.store_id,
      userId: updated.user_id,
      value: updated.value,
    };
  }

  async getRatingsCount() {
    return this.ratingRepository.count();
  }
}
