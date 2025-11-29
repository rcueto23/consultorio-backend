import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('stats')
@UseGuards(JwtAuthGuard)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('dashboard')
  @HttpCode(HttpStatus.OK)
  getDashboardStats() {
    return this.statsService.getDashboardStats();
  }
}
