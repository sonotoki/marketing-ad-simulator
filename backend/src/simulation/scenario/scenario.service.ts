
import { Injectable } from '@nestjs/common';
import { ScenarioInputDto } from './dto/compare-scenarios.dto';
import { BusinessCategory } from '../../common/enums/business-category.enum';

@Injectable()
export class ScenarioService {
  compare(businessCategory: BusinessCategory, scenarios: ScenarioInputDto[]) {
    return scenarios.map((scenario) => {
      const {
        name,
        budget,
        cpc,
        cvr,
        sellingPrice,
        productCostRate,
      } = scenario;

      const clicks = budget / cpc;
      const conversions = clicks * (cvr / 100);
      const cpa = conversions > 0 ? budget / conversions : 0;
      const revenue = conversions * sellingPrice;
      const productCost = revenue * (productCostRate / 100);
      const profit = revenue - productCost - budget;
      const roas = (revenue / budget) * 100;
      const roi = (profit / budget) * 100;

      return {
        businessCategory,
        name,
        inputs: scenario,
        results: {
          clicks: Number(clicks.toFixed(2)),
          conversions: Number(conversions.toFixed(2)),
          cpa: Number(cpa.toFixed(2)),
          revenue: Number(revenue.toFixed(2)),
          productCost: Number(productCost.toFixed(2)),
          profit: Number(profit.toFixed(2)),
          roas: Number(roas.toFixed(2)),
          roi: Number(roi.toFixed(2)),
        },
      };
    });
  }
}
