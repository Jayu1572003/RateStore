import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import { Store } from '../stores/store.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserFilterDto } from './dto/user-filter.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>
  ) {}

  async create(createUserDto: CreateUserDto) {
    const {
      name,
      email,
      password,
      address,
      role = UserRole.NORMAL_USER,
      storeName,
      storeEmail,
      storeAddress,
    } = createUserDto;

    // Check if email already exists
    const existing = await this.userRepository.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException(`Email ${email} is already in use`);
    }

    // Check store details if role is store owner
    if (role === UserRole.STORE_OWNER) {
      if (!storeName || !storeEmail || !storeAddress) {
        throw new BadRequestException(
          'Store name, email, and address are required for store owners'
        );
      }
      const existingStore = await this.storeRepository.findOne({
        where: { email: storeEmail },
      });
      if (existingStore) {
        throw new ConflictException(`Store email ${storeEmail} is already in use`);
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

    if (role === UserRole.STORE_OWNER) {
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

  async findAll(filterDto: UserFilterDto) {
    const {
      name,
      email,
      address,
      role,
      sortBy = 'created_at',
      sortOrder = 'DESC',
      page = 1,
      limit = 10,
    } = filterDto;

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    // We only list normal_user or admin (NOT store_owners)
    queryBuilder.where('user.role IN (:...roles)', {
      roles: [UserRole.NORMAL_USER, UserRole.ADMIN],
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

    queryBuilder.orderBy(`user.${sortBy}`, sortOrder as 'ASC' | 'DESC');

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

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['stores', 'stores.ratings'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const { password, ...userWithoutPassword } = user;

    if (user.role === UserRole.STORE_OWNER) {
      const store = await this.storeRepository.findOne({
        where: { owner_id: user.id },
        relations: ['ratings'],
      });

      let avgRating: number | null = null;
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

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const matches = await bcrypt.compare(
      updatePasswordDto.currentPassword,
      user.password
    );
    if (!matches) {
      throw new BadRequestException('Incorrect current password');
    }

    user.password = await bcrypt.hash(updatePasswordDto.newPassword, 10);
    await this.userRepository.save(user);

    return { message: 'Password updated' };
  }
}
