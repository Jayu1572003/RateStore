import {
  Controller,
  Post,
  Patch,
  Get,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { SubmitRatingDto } from './dto/submit-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/user.entity';

@Controller('ratings')
@UseGuards(JwtAuthGuard)
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.NORMAL_USER)
  submit(
    @Body() submitRatingDto: SubmitRatingDto,
    @CurrentUser() user: any
  ) {
    return this.ratingsService.submit(submitRatingDto, user.userId);
  }

  @Patch(':storeId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.NORMAL_USER)
  update(
    @Param('storeId') storeId: string,
    @Body() updateRatingDto: UpdateRatingDto,
    @CurrentUser() user: any
  ) {
    return this.ratingsService.update(storeId, updateRatingDto, user.userId);
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async getStats() {
    const count = await this.ratingsService.getRatingsCount();
    return { totalRatings: count };
  }
}
