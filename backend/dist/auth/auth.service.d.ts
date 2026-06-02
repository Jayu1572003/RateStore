import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../users/user.entity';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        role: any;
        name: any;
    }>;
    getProfile(userId: string): Promise<{
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
    register(createUserDto: any): Promise<{
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
}
