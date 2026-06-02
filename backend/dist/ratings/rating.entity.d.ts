import { User } from '../users/user.entity';
import { Store } from '../stores/store.entity';
export declare class Rating {
    id: string;
    user_id: string;
    store_id: string;
    user: User;
    store: Store;
    value: number;
    created_at: Date;
    updated_at: Date;
    setCreated(): void;
    setUpdated(): void;
}
