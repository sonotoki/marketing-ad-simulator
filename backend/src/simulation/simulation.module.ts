import { Module } from '@nestjs/common';
import { SimulationService } from './simulation.service';
import { SimulationController } from './simulation.controller';
import { ScenarioModule } from './scenario/scenario.module';
import { MonteCarloService } from './monte-carlo/monte-carlo.service';

@Module({
  imports: [ScenarioModule],
  providers: [SimulationService, MonteCarloService],
  controllers: [SimulationController],
})
export class SimulationModule {}
