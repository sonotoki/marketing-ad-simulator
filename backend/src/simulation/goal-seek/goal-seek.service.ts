import { Injectable } from '@nestjs/common';
import { GoalSeekDto } from './dto/goal-seek.dto';

@Injectable()
export class GoalSeekService {
  calculate(dto: GoalSeekDto) {
    const {
      targetProfit,
      cpc,
      cvr,
      sellingPrice,
      productCostRate,
    } = dto;

    // Revenue per 1 yen of advertising budget
    const revenueRate =
      (sellingPrice * (cvr / 100)) / cpc;

    // Profit margin after product cost and advertising
    const profitRate =
      revenueRate * (1 - productCostRate / 100) - 1;

    // Positive profit cannot be achieved with these assumptions
    if (profitRate <= 0) {
      return {
        success: false,
        message:
          'The target profit cannot be achieved with the current campaign parameters.',
        profitRate: Number((profitRate * 100).toFixed(2)),
      };
    }

    const requiredBudget = Math.ceil(
      targetProfit / profitRate - 1e-9,
    );

    return {
      success: true,
      inputs: dto,
      results: {
        requiredBudget: Math.ceil(requiredBudget),
        targetProfit,
        expectedRevenue: Math.round(
          requiredBudget * revenueRate,
        ),
        profitRate: Number((profitRate * 100).toFixed(2)),
      },
    };
  }
}