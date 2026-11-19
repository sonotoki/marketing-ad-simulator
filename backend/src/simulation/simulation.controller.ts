import { Body, Controller, Post } from '@nestjs/common';
import { SimulationService } from './simulation.service';
import { SimulateDto } from './dto/simulate.dto';

@Controller('simulation')
export class SimulationController {
  constructor(
    private readonly simulationService: SimulationService,
  ) {}

  @Post()
  simulate(@Body() dto: SimulateDto) {
    return this.simulationService.simulate(dto);
  }
}