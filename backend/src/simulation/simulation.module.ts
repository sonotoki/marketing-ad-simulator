import { Module } from '@nestjs/common';
import { SimulationService } from './simulation.service';
import { SimulationController } from './simulation.controller';
import { ScenarioModule } from './scenario/scenario.module';
import { MonteCarloService } from './monte-carlo/monte-carlo.service';
import { GoalSeekService } from './goal-seek/goal-seek.service';
import { GoalSeekController } from './goal-seek/goal-seek.controller';

@Module({
  imports: [ScenarioModule],
  providers: [
    SimulationService,
    MonteCarloService,
    GoalSeekService,
  ],
  controllers: [
    SimulationController,
    GoalSeekController,
  ],
})
export class SimulationModule {}