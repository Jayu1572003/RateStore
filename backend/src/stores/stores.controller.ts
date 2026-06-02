import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoreFilterDto } from './dto/store-filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/user.entity';

@Controller('stores')
@UseGuards(JwtAuthGuard)
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get()
  findAll(
    @Query() filterDto: StoreFilterDto,
    @CurrentUser() user: any
  ) {
    const userId = user.role === UserRole.NORMAL_USER ? user.userId : null;
    return this.storesService.findAll(filterDto, userId);
  }

  @Get('owner/dashboard')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STORE_OWNER)
  getOwnerDashboard(@CurrentUser() user: any) {
    return this.storesService.getOwnerDashboard(user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storesService.findOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  create(
    @Body()
    createStoreDto: {
      name: string;
      email: string;
      address: string;
      ownerId?: string;
    }
  ) {
    return this.storesService.create(createStoreDto);
  }
}
