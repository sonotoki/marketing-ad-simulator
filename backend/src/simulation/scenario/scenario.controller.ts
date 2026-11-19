
import { Body, Controller, Post } from '@nestjs/common';
import { ScenarioService } from './scenario.service';
import { CompareScenariosDto } from './dto/compare-scenarios.dto';

@Controller('scenarios')
export class ScenarioController {
  constructor(
    private readonly scenarioService: ScenarioService,
  ) {}

  @Post('compare')
  compare(@Body() dto: CompareScenariosDto) {
    return this.scenarioService.compare(dto.scenarios);
  }
}
