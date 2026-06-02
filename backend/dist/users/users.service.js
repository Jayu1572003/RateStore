"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const store_entity_1 = require("../stores/store.entity");
const bcrypt = __importStar(require("bcrypt"));
let UsersService = class UsersService {
    userRepository;
    storeRepository;
    constructor(userRepository, storeRepository) {
        this.userRepository = userRepository;
        this.storeRepository = storeRepository;
    }
    async create(createUserDto) {
        const { name, email, password, address, role = user_entity_1.UserRole.NORMAL_USER, storeName, storeEmail, storeAddress, } = createUserDto;
        const existing = await this.userRepository.findOne({ where: { email } });
        if (existing) {
            throw new common_1.ConflictException(`Email ${email} is already in use`);
        }
        if (role === user_entity_1.UserRole.STORE_OWNER) {
            if (!storeName || !storeEmail || !storeAddress) {
                throw new common_1.BadRequestException('Store name, email, and address are required for store owners');
            }
            const existingStore = await this.storeRepository.findOne({
                where: { email: storeEmail },
            });
            if (existingStore) {
                throw new common_1.ConflictException(`Store email ${storeEmail} is already in use`);
            }
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({
            name,
            email,
            password: hashedPassword,
            address,
            role,
        });
        const savedUser = await this.userRepository.save(user);
        if (role === user_entity_1.UserRole.STORE_OWNER) {
            const store = this.storeRepository.create({
                name: storeName,
                email: storeEmail,
                address: storeAddress,
                owner_id: savedUser.id,
            });
            await this.storeRepository.save(store);
        }
        const { password: _, ...result } = savedUser;
        return result;
    }
    async findAll(filterDto) {
        const { name, email, address, role, sortBy = 'created_at', sortOrder = 'DESC', page = 1, limit = 10, } = filterDto;
        const queryBuilder = this.userRepository.createQueryBuilder('user');
        queryBuilder.where('user.role IN (:...roles)', {
            roles: [user_entity_1.UserRole.NORMAL_USER, user_entity_1.UserRole.ADMIN],
        });
        if (name) {
            queryBuilder.andWhere('user.name ILIKE :name', { name: `%${name}%` });
        }
        if (email) {
            queryBuilder.andWhere('user.email ILIKE :email', { email: `%${email}%` });
        }
        if (address) {
            queryBuilder.andWhere('user.address ILIKE :address', { address: `%${address}%` });
        }
        if (role) {
            queryBuilder.andWhere('user.role = :role', { role });
        }
        queryBuilder.orderBy(`user.${sortBy}`, sortOrder);
        const skip = (page - 1) * limit;
        queryBuilder.skip(skip).take(limit);
        const [data, total] = await queryBuilder.getManyAndCount();
        const cleanedData = data.map((user) => {
            const { password, ...rest } = user;
            return rest;
        });
        return {
            data: cleanedData,
            total,
            page,
            limit,
        };
    }
    async findOne(id) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['stores', 'stores.ratings'],
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        const { password, ...userWithoutPassword } = user;
        if (user.role === user_entity_1.UserRole.STORE_OWNER) {
            const store = await this.storeRepository.findOne({
                where: { owner_id: user.id },
                relations: ['ratings'],
            });
            let avgRating = null;
            if (store) {
                avgRating = store.avgRating;
            }
            return {
                ...userWithoutPassword,
                store: store
                    ? {
                        id: store.id,
                        name: store.name,
                        email: store.email,
                        address: store.address,
                        avgRating,
                    }
                    : null,
            };
        }
        return userWithoutPassword;
    }
    async findByEmail(email) {
        return this.userRepository.findOne({ where: { email } });
    }
    async updatePassword(userId, updatePasswordDto) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const matches = await bcrypt.compare(updatePasswordDto.currentPassword, user.password);
        if (!matches) {
            throw new common_1.BadRequestException('Incorrect current password');
        }
        user.password = await bcrypt.hash(updatePasswordDto.newPassword, 10);
        await this.userRepository.save(user);
        return { message: 'Password updated' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(store_entity_1.Store)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map