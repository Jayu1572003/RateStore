import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(req: any): Promise<{
        access_token: string;
        role: any;
        name: any;
    }>;
    logout(): {
        message: string;
    };
    getProfile(user: any): Promise<{
        id: string;
        name: string;
        email: string;
        address: string;
        role: import("../users/user.entity").UserRole;
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
        role: import("../users/user.entity").UserRole;
        created_at: Date;
        updated_at: Date;
        ratings: import("../ratings/rating.entity").Rating[];
        stores: import("../stores/store.entity").Store[];
    }>;
    register(createUserDto: CreateUserDto): Promise<{
        id: string;
        name: string;
        email: string;
        address: string;
        role: import("../users/user.entity").UserRole;
        created_at: Date;
        updated_at: Date;
        ratings: import("../ratings/rating.entity").Rating[];
        stores: import("../stores/store.entity").Store[];
    }>;
}
