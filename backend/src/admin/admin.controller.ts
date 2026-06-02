import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Store } from '../stores/store.entity';
import { Rating } from '../ratings/rating.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>
  ) {}

  @Get('dashboard')
  async getDashboardStats() {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      this.userRepository.count(),
      this.storeRepository.count(),
      this.ratingRepository.count(),
    ]);

    return {
      totalUsers,
      totalStores,
      totalRatings,
    };
  }
}
