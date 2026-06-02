import { IsString, IsEmail, MinLength, MaxLength, Matches, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../user.entity';

export class CreateUserDto {
  @IsString()
  @MinLength(20, { message: 'Name must be at least 20 characters long' })
  @MaxLength(60, { message: 'Name cannot exceed 60 characters' })
  name: string;

  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(16, { message: 'Password cannot exceed 16 characters' })
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/, {
    message: 'Password must contain at least one uppercase letter and one special character (!@#$%^&*)',
  })
  password: string;

  @IsString()
  @MaxLength(400, { message: 'Address cannot exceed 400 characters' })
  address: string;

  @IsEnum(UserRole, { message: 'Invalid role type' })
  @IsOptional()
  role?: UserRole;

  // Optional fields for store creation if role is store_owner
  @IsOptional()
  @IsString()
  @MaxLength(60)
  storeName?: string;

  @IsOptional()
  @IsEmail()
  storeEmail?: string;

  @IsOptional()
  @IsString()
  @MaxLength(400)
  storeAddress?: string;
}
