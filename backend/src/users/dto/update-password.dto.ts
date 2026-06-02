import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @MinLength(8, { message: 'New password must be at least 8 characters' })
  @MaxLength(16, { message: 'New password cannot exceed 16 characters' })
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/, {
    message: 'New password must contain at least one uppercase letter and one special character (!@#$%^&*)',
  })
  newPassword: string;
}
