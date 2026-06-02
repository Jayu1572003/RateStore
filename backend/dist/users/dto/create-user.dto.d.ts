import { UserRole } from '../user.entity';
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    address: string;
    role?: UserRole;
    storeName?: string;
    storeEmail?: string;
    storeAddress?: string;
}
