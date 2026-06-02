import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import { Store } from '../stores/store.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserFilterDto } from './dto/user-filter.dto';
export declare class UsersService {
    private readonly userRepository;
    private readonly storeRepository;
    constructor(userRepository: Repository<User>, storeRepository: Repository<Store>);
    create(createUserDto: CreateUserDto): Promise<{
        id: string;
        name: string;
        email: string;
        address: string;
        role: UserRole;
        created_at: Date;
        updated_at: Date;
        ratings: import("../ratings/rating.entity").Rating[];
        stores: Store[];
    }>;
    findAll(filterDto: UserFilterDto): Promise<{
        data: {
            id: string;
            name: string;
            email: string;
            address: string;
            role: UserRole;
            created_at: Date;
            updated_at: Date;
            ratings: import("../ratings/rating.entity").Rating[];
            stores: Store[];
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
        role: UserRole;
        created_at: Date;
        updated_at: Date;
        ratings: import("../ratings/rating.entity").Rating[];
        stores: Store[];
    } | {
        store: {
            id: string;
            name: string;
            email: string;
            address: string;
            avgRating: number | null;
        } | null;
        id: string;
        name: string;
        email: string;
        address: string;
        role: UserRole;
        created_at: Date;
        updated_at: Date;
        ratings: import("../ratings/rating.entity").Rating[];
        stores: Store[];
    }>;
    findByEmail(email: string): Promise<User | null>;
    updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto): Promise<{
        message: string;
    }>;
}
