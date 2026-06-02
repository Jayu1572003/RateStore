import { Store } from '../stores/store.entity';
import { Rating } from '../ratings/rating.entity';
export declare enum UserRole {
    ADMIN = "admin",
    NORMAL_USER = "normal_user",
    STORE_OWNER = "store_owner"
}
export declare class User {
    id: string;
    name: string;
    email: string;
    password: string;
    address: string;
    role: UserRole;
    created_at: Date;
    updated_at: Date;
    ratings: Rating[];
    stores: Store[];
    setCreated(): void;
    setUpdated(): void;
}
