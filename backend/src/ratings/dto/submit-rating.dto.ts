import { IsUUID, IsInt, Min, Max } from 'class-validator';

export class SubmitRatingDto {
  @IsUUID(4, { message: 'Invalid store ID format' })
  storeId: string;

  @IsInt({ message: 'Rating must be an integer' })
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating cannot exceed 5' })
  value: number;
}
