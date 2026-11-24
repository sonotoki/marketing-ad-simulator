
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SimulationModule } from './simulation/simulation.module';

@Module({
  imports: [PrismaModule, SimulationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
