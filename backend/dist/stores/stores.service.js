"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoresService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const store_entity_1 = require("./store.entity");
const user_entity_1 = require("../users/user.entity");
let StoresService = class StoresService {
    storeRepository;
    userRepository;
    constructor(storeRepository, userRepository) {
        this.storeRepository = storeRepository;
        this.userRepository = userRepository;
    }
    async create(createStoreDto) {
        const existing = await this.storeRepository.findOne({
            where: { email: createStoreDto.email },
        });
        if (existing) {
            throw new common_1.ConflictException(`Store email ${createStoreDto.email} is already in use`);
        }
        let owner = null;
        if (createStoreDto.ownerId) {
            const user = await this.userRepository.findOne({
                where: { id: createStoreDto.ownerId },
            });
            if (!user) {
                throw new common_1.NotFoundException(`User with ID ${createStoreDto.ownerId} not found`);
            }
            if (user.role !== user_entity_1.UserRole.STORE_OWNER) {
                throw new common_1.BadRequestException('User must be a store owner to be assigned to a store');
            }
            owner = user;
        }
        const store = this.storeRepository.create({
            name: createStoreDto.name,
            email: createStoreDto.email,
            address: createStoreDto.address,
            owner_id: createStoreDto.ownerId || null,
        });
        return this.storeRepository.save(store);
    }
    async findAll(filterDto, userId) {
        const { name, search, address, sortBy = 'name', sortOrder = 'ASC', page = 1, limit = 10, } = filterDto;
        const queryBuilder = this.storeRepository.createQueryBuilder('store');
        queryBuilder
            .leftJoin('store.ratings', 'rating')
            .select([
            'store.id',
            'store.name',
            'store.email',
            'store.address',
            'store.created_at',
        ])
            .addSelect('AVG(rating.value)', 'avgRating');
        if (userId) {
            queryBuilder.addSelect((subQuery) => {
                return subQuery
                    .select('user_rating.value')
                    .from('ratings', 'user_rating')
                    .where('user_rating.store_id = store.id')
                    .andWhere('user_rating.user_id = :userId', { userId });
            }, 'userRating');
        }
        else {
            queryBuilder.addSelect('NULL', 'userRating');
        }
        if (name) {
            queryBuilder.andWhere('store.name ILIKE :name', { name: `%${name}%` });
        }
        if (address) {
            queryBuilder.andWhere('store.address ILIKE :address', { address: `%${address}%` });
        }
        if (search) {
            queryBuilder.andWhere('(store.name ILIKE :search OR store.address ILIKE :search)', { search: `%${search}%` });
        }
        queryBuilder.groupBy('store.id');
        if (sortBy === 'rating') {
            queryBuilder.orderBy('AVG(rating.value)', sortOrder);
        }
        else {
            queryBuilder.orderBy(`store.${sortBy}`, sortOrder);
        }
        const countQuery = this.storeRepository.createQueryBuilder('store');
        if (name) {
            countQuery.andWhere('store.name ILIKE :name', { name: `%${name}%` });
        }
        if (address) {
            countQuery.andWhere('store.address ILIKE :address', { address: `%${address}%` });
        }
        if (search) {
            countQuery.andWhere('(store.name ILIKE :search OR store.address ILIKE :search)', { search: `%${search}%` });
        }
        const total = await countQuery.getCount();
        const skip = (page - 1) * limit;
        queryBuilder.offset(skip).limit(limit);
        const rawResults = await queryBuilder.getRawMany();
        const data = rawResults.map((raw) => ({
            id: raw.store_id,
            name: raw.store_name,
            email: raw.store_email,
            address: raw.store_address,
            avgRating: raw.avgRating
                ? Math.round(parseFloat(raw.avgRating) * 10) / 10
                : null,
            userRating: raw.userRating !== null && raw.userRating !== undefined
                ? parseInt(raw.userRating)
                : null,
        }));
        return {
            data,
            total,
            page,
            limit,
        };
    }
    async findOne(id) {
        const store = await this.storeRepository.findOne({
            where: { id },
            relations: ['ratings'],
        });
        if (!store) {
            throw new common_1.NotFoundException(`Store with ID ${id} not found`);
        }
        return {
            id: store.id,
            name: store.name,
            email: store.email,
            address: store.address,
            avgRating: store.avgRating,
        };
    }
    async getOwnerDashboard(ownerId) {
        const store = await this.storeRepository.findOne({
            where: { owner_id: ownerId },
            relations: ['ratings', 'ratings.user'],
        });
        if (!store) {
            throw new common_1.NotFoundException('No store found for this store owner');
        }
        const raters = store.ratings.map((r) => ({
            userId: r.user.id,
            userName: r.user.name,
            userEmail: r.user.email,
            ratingValue: r.value,
            ratedAt: r.created_at,
        }));
        return {
            store: {
                id: store.id,
                name: store.name,
                email: store.email,
                address: store.address,
            },
            avgRating: store.avgRating,
            raters,
        };
    }
    async getStoresCount() {
        return this.storeRepository.count();
    }
};
exports.StoresService = StoresService;
exports.StoresService = StoresService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(store_entity_1.Store)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], StoresService);
//# sourceMappingURL=stores.service.js.map