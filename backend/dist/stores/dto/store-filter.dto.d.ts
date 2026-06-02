export declare class StoreFilterDto {
    name?: string;
    search?: string;
    email?: string;
    address?: string;
    sortBy?: 'name' | 'email' | 'address' | 'rating';
    sortOrder?: 'ASC' | 'DESC';
    page?: number;
    limit?: number;
}
