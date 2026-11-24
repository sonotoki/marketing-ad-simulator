import { Type } from 'class-transformer';
import {
  IsNumber,
  Max,
  Min,
} from 'class-validator';

export class SimulateDto {
  @Type(() => Number)
  @IsNumber()
  @Min(100000)
  @Max(5000000)
  budget: number;

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
