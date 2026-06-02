import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Store } from '../stores/store.entity';
import { Rating } from '../ratings/rating.entity';
export declare class AdminController {
    private readonly userRepository;
    private readonly storeRepository;
    private readonly ratingRepository;
    constructor(userRepository: Repository<User>, storeRepository: Repository<Store>, ratingRepository: Repository<Rating>);
    getDashboardStats(): Promise<{
        totalUsers: number;
        totalStores: number;
        totalRatings: number;
    }>;
}
