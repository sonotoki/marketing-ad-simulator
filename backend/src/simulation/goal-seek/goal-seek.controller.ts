import { Body, Controller, Post } from '@nestjs/common';
import { GoalSeekService } from './goal-seek.service';
import { GoalSeekDto } from './dto/goal-seek.dto';

@Controller('simulation/goal-seek')
export class GoalSeekController {
  constructor(
    private readonly goalSeekService: GoalSeekService,
  ) {}

  @Post()
  calculate(@Body() dto: GoalSeekDto) {
    return this.goalSeekService.calculate(dto);
  }
}