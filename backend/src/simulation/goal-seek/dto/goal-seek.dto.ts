import { Type } from 'class-transformer';
import { BusinessCategory } from '../../../common/enums/business-category.enum';
import {
  IsEnum,
  IsNumber,
  Max,
  Min,
} from 'class-validator';

export class GoalSeekDto {
  @IsEnum(BusinessCategory)
  businessCategory: BusinessCategory;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  targetProfit: number;

  @Type(() => Number)
  @IsNumber()
  @Min(10)
  @Max(1000)
  cpc: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0.1)
  @Max(10)
  cvr: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  sellingPrice: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  productCostRate: number;
}