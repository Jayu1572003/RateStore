import { User } from '../users/user.entity';
import { Rating } from '../ratings/rating.entity';
export declare class Store {
    id: string;
    name: string;
    email: string;
    address: string;
    owner_id: string | null;
    owner: User | null;
    ratings: Rating[];
    created_at: Date;
    updated_at: Date;
    get avgRating(): number | null;
    setCreated(): void;
    setUpdated(): void;
}
