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
exports.RatingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const rating_entity_1 = require("./rating.entity");
const store_entity_1 = require("../stores/store.entity");
let RatingsService = class RatingsService {
    ratingRepository;
    storeRepository;
    constructor(ratingRepository, storeRepository) {
        this.ratingRepository = ratingRepository;
        this.storeRepository = storeRepository;
    }
    async submit(submitRatingDto, userId) {
        const { storeId, value } = submitRatingDto;
        const store = await this.storeRepository.findOne({ where: { id: storeId } });
        if (!store) {
            throw new common_1.NotFoundException(`Store with ID ${storeId} not found`);
        }
        const existing = await this.ratingRepository.findOne({
            where: { user_id: userId, store_id: storeId },
        });
        if (existing) {
            throw new common_1.ConflictException('You have already rated this store');
        }
        const rating = this.ratingRepository.create({
            user_id: userId,
            store_id: storeId,
            value,
        });
        const saved = await this.ratingRepository.save(rating);
        return {
            id: saved.id,
            storeId: saved.store_id,
            userId: saved.user_id,
            value: saved.value,
        };
    }
    async update(storeId, updateRatingDto, userId) {
        const rating = await this.ratingRepository.findOne({
            where: { store_id: storeId, user_id: userId },
        });
        if (!rating) {
            const anyRatingForStore = await this.ratingRepository.findOne({
                where: { store_id: storeId },
            });
            if (anyRatingForStore) {
                throw new common_1.ForbiddenException('You do not own this rating');
            }
            else {
                throw new common_1.NotFoundException('Rating not found');
            }
        }
        rating.value = updateRatingDto.value;
        const updated = await this.ratingRepository.save(rating);
        return {
            id: updated.id,
            storeId: updated.store_id,
            userId: updated.user_id,
            value: updated.value,
        };
    }
    async getRatingsCount() {
        return this.ratingRepository.count();
    }
};
exports.RatingsService = RatingsService;
exports.RatingsService = RatingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(rating_entity_1.Rating)),
    __param(1, (0, typeorm_1.InjectRepository)(store_entity_1.Store)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], RatingsService);
//# sourceMappingURL=ratings.service.js.map