import { Injectable } from '@nestjs/common';
import { MonteCarloDto } from './dto/monte-carlo.dto';

type SimulationResult = {
  profit: number;
  cpa: number;
  revenue: number;
};

@Injectable()
export class MonteCarloService {
  private readonly simulationCount = 1000;
  private readonly variation = 0.2;

  private randomValue(value: number, min: number, max: number): number {
    const factor =
      1 - this.variation + Math.random() * this.variation * 2;

    return Math.min(Math.max(value * factor, min), max);
  }

  private percentile(values: number[], percentile: number): number {
    const sorted = [...values].sort((a, b) => a - b);
    const index = (percentile / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;

    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
  }

  simulate(dto: MonteCarloDto) {
    const simulations: SimulationResult[] = [];

    for (let i = 0; i < this.simulationCount; i++) {
      const cpc = this.randomValue(dto.cpc, 10, 1000);
      const cvr = this.randomValue(dto.cvr, 0.1, 10);

      const clicks = dto.budget / cpc;
      const conversions = clicks * (cvr / 100);
      const revenue = conversions * dto.sellingPrice;
      const productCost = revenue * (dto.productCostRate / 100);
      const profit = revenue - productCost - dto.budget;
      const cpa = conversions > 0 ? dto.budget / conversions : 0;

      simulations.push({ profit, cpa, revenue });
    }

    const profits = simulations.map((item) => item.profit);
    const cpas = simulations.map((item) => item.cpa);
    const revenues = simulations.map((item) => item.revenue);

    const summary = (values: number[]) => ({
      p10: Number(this.percentile(values, 10).toFixed(2)),
      p50: Number(this.percentile(values, 50).toFixed(2)),
      p90: Number(this.percentile(values, 90).toFixed(2)),
    });

    return {
      businessCategory: dto.businessCategory,
      simulationCount: this.simulationCount,
      variation: this.variation * 100,
      results: {
        profit: summary(profits),
        cpa: summary(cpas),
        revenue: summary(revenues),
      },
    };
  }
}
