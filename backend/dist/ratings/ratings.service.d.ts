import { Repository } from 'typeorm';
import { Rating } from './rating.entity';
import { Store } from '../stores/store.entity';
import { SubmitRatingDto } from './dto/submit-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
export declare class RatingsService {
    private readonly ratingRepository;
    private readonly storeRepository;
    constructor(ratingRepository: Repository<Rating>, storeRepository: Repository<Store>);
    submit(submitRatingDto: SubmitRatingDto, userId: string): Promise<{
        id: string;
        storeId: string;
        userId: string;
        value: number;
    }>;
    update(storeId: string, updateRatingDto: UpdateRatingDto, userId: string): Promise<{
        id: string;
        storeId: string;
        userId: string;
        value: number;
    }>;
    getRatingsCount(): Promise<number>;
}
