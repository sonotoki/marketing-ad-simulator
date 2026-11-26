
import { BusinessCategory } from '../../../common/enums/business-category.enum';
import {
  ArrayMaxSize,
  IsEnum,
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ScenarioInputDto {
  @IsString()
  name: string;

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

export class CompareScenariosDto {
  @IsEnum(BusinessCategory)
  businessCategory: BusinessCategory;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(3)
  @ValidateNested({ each: true })
  @Type(() => ScenarioInputDto)
  scenarios: ScenarioInputDto[];
}
