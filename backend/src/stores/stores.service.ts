import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './store.entity';
import { User, UserRole } from '../users/user.entity';
import { StoreFilterDto } from './dto/store-filter.dto';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(createStoreDto: {
    name: string;
    email: string;
    address: string;
    ownerId?: string;
  }) {
    const existing = await this.storeRepository.findOne({
      where: { email: createStoreDto.email },
    });
    if (existing) {
      throw new ConflictException(`Store email ${createStoreDto.email} is already in use`);
    }

    let owner = null;
    if (createStoreDto.ownerId) {
      const user = await this.userRepository.findOne({
        where: { id: createStoreDto.ownerId },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${createStoreDto.ownerId} not found`);
      }
      if (user.role !== UserRole.STORE_OWNER) {
        throw new BadRequestException('User must be a store owner to be assigned to a store');
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

  async findAll(filterDto: StoreFilterDto & { search?: string }, userId?: string) {
    const {
      name,
      search,
      address,
      sortBy = 'name',
      sortOrder = 'ASC',
      page = 1,
      limit = 10,
    } = filterDto;

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
    } else {
      queryBuilder.addSelect('NULL', 'userRating');
    }

    if (name) {
      queryBuilder.andWhere('store.name ILIKE :name', { name: `%${name}%` });
    }
    if (address) {
      queryBuilder.andWhere('store.address ILIKE :address', { address: `%${address}%` });
    }
    if (search) {
      queryBuilder.andWhere(
        '(store.name ILIKE :search OR store.address ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    queryBuilder.groupBy('store.id');

    if (sortBy === 'rating') {
      queryBuilder.orderBy('AVG(rating.value)', sortOrder as 'ASC' | 'DESC');
    } else {
      queryBuilder.orderBy(`store.${sortBy}`, sortOrder as 'ASC' | 'DESC');
    }

    const countQuery = this.storeRepository.createQueryBuilder('store');
    if (name) {
      countQuery.andWhere('store.name ILIKE :name', { name: `%${name}%` });
    }
    if (address) {
      countQuery.andWhere('store.address ILIKE :address', { address: `%${address}%` });
    }
    if (search) {
      countQuery.andWhere(
        '(store.name ILIKE :search OR store.address ILIKE :search)',
        { search: `%${search}%` }
      );
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
      userRating:
        raw.userRating !== null && raw.userRating !== undefined
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

  async findOne(id: string) {
    const store = await this.storeRepository.findOne({
      where: { id },
      relations: ['ratings'],
    });
    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }
    return {
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      avgRating: store.avgRating,
    };
  }

  async getOwnerDashboard(ownerId: string) {
    const store = await this.storeRepository.findOne({
      where: { owner_id: ownerId },
      relations: ['ratings', 'ratings.user'],
    });

    if (!store) {
      throw new NotFoundException('No store found for this store owner');
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
}
