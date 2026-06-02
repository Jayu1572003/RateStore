import { StoresService } from './stores.service';
import { StoreFilterDto } from './dto/store-filter.dto';
export declare class StoresController {
    private readonly storesService;
    constructor(storesService: StoresService);
    findAll(filterDto: StoreFilterDto, user: any): Promise<{
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
    getOwnerDashboard(user: any): Promise<{
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
    findOne(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        address: string;
        avgRating: number | null;
    }>;
    create(createStoreDto: {
        name: string;
        email: string;
        address: string;
        ownerId?: string;
    }): Promise<import("./store.entity").Store>;
}
