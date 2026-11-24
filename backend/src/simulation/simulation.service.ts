import { Injectable } from '@nestjs/common';
import { SimulateDto } from './dto/simulate.dto';

@Injectable()
export class SimulationService {
  simulate(dto: SimulateDto) {
    const {
      budget,
      cpc,
      cvr,
      sellingPrice,
      productCostRate,
    } = dto;

    // 1. Clicks
    const clicks = budget / cpc;

    // 2. Conversions
    const conversions = clicks * (cvr / 100);

    // 3. CPA
    const cpa = conversions > 0 ? budget / conversions : 0;

    // 4. Revenue
    const revenue = conversions * sellingPrice;

    // 5. Product cost
    const productCost = revenue * (productCostRate / 100);

    // 6. Gross profit
    const grossProfit = revenue - productCost - budget;

    // 7. ROAS
    const roas = (revenue / budget) * 100;

    // 8. ROI
    const roi = (grossProfit / budget) * 100;

    return {
      inputs: dto,
      results: {
        clicks: Number(clicks.toFixed(2)),
        conversions: Number(conversions.toFixed(2)),
        cpa: Number(cpa.toFixed(2)),
        revenue: Number(revenue.toFixed(2)),
        productCost: Number(productCost.toFixed(2)),
        grossProfit: Number(grossProfit.toFixed(2)),
        roas: Number(roas.toFixed(2)),
        roi: Number(roi.toFixed(2)),
      },
    };
  }
}