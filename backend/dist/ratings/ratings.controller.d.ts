import { RatingsService } from './ratings.service';
import { SubmitRatingDto } from './dto/submit-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
export declare class RatingsController {
    private readonly ratingsService;
    constructor(ratingsService: RatingsService);
    submit(submitRatingDto: SubmitRatingDto, user: any): Promise<{
        id: string;
        storeId: string;
        userId: string;
        value: number;
    }>;
    update(storeId: string, updateRatingDto: UpdateRatingDto, user: any): Promise<{
        id: string;
        storeId: string;
        userId: string;
        value: number;
    }>;
    getStats(): Promise<{
        totalRatings: number;
    }>;
}
