import { UserRole } from '../user.entity';
export declare class UserFilterDto {
    name?: string;
    email?: string;
    address?: string;
    role?: UserRole;
    sortBy?: 'name' | 'email' | 'address' | 'role' | 'created_at';
    sortOrder?: 'ASC' | 'DESC';
    page?: number;
    limit?: number;
}
