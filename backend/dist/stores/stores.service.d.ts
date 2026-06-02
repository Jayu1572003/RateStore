import { Repository } from 'typeorm';
import { Store } from './store.entity';
import { User } from '../users/user.entity';
import { StoreFilterDto } from './dto/store-filter.dto';
export declare class StoresService {
    private readonly storeRepository;
    private readonly userRepository;
    constructor(storeRepository: Repository<Store>, userRepository: Repository<User>);
    create(createStoreDto: {
        name: string;
        email: string;
        address: string;
        ownerId?: string;
    }): Promise<Store>;
    findAll(filterDto: StoreFilterDto & {
        search?: string;
    }, userId?: string): Promise<{
        data: {
            id: any;
            name: any;
            email: any;
            address: any;
            avgRating: number | null;
            userRating: number | null;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        address: string;
        avgRating: number | null;
    }>;
    getOwnerDashboard(ownerId: string): Promise<{
        store: {
            id: string;
            name: string;
            email: string;
            address: string;
        };
        avgRating: number | null;
        raters: {
            userId: string;
            userName: string;
            userEmail: string;
            ratingValue: number;
            ratedAt: Date;
        }[];
    }>;
    getStoresCount(): Promise<number>;
}
