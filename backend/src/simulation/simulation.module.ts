
import { Module } from '@nestjs/common';
import { SimulationService } from './simulation.service';
import { SimulationController } from './simulation.controller';
import { ScenarioModule } from './scenario/scenario.module';

@Module({
  imports: [ScenarioModule],
  providers: [SimulationService],
  controllers: [SimulationController],
})
export class SimulationModule {}
