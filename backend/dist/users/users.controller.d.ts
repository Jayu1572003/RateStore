import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserFilterDto } from './dto/user-filter.dto';
import { UserRole } from './user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<{
        id: string;
        name: string;
        email: string;
        address: string;
        role: UserRole;
        created_at: Date;
        updated_at: Date;
        ratings: import("../ratings/rating.entity").Rating[];
        stores: import("../stores/store.entity").Store[];
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
            stores: import("../stores/store.entity").Store[];
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
        stores: import("../stores/store.entity").Store[];
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
        stores: import("../stores/store.entity").Store[];
    }>;
    updatePassword(user: any, updatePasswordDto: UpdatePasswordDto): Promise<{
        message: string;
    }>;
}
