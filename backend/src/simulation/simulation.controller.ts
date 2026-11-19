import { Body, Controller, Post } from '@nestjs/common';
import { SimulationService } from './simulation.service';
import { SimulateDto } from './dto/simulate.dto';
import { MonteCarloService } from './monte-carlo/monte-carlo.service';
import { MonteCarloDto } from './monte-carlo/dto/monte-carlo.dto';

@Controller('simulation')
export class SimulationController {
  constructor(
    private readonly simulationService: SimulationService,
    private readonly monteCarloService: MonteCarloService,
  ) {}

  @Post()
  simulate(@Body() dto: SimulateDto) {
    return this.simulationService.simulate(dto);
  }

  @Post('monte-carlo')
  monteCarlo(@Body() dto: MonteCarloDto) {
    return this.monteCarloService.simulate(dto);
  }
}
