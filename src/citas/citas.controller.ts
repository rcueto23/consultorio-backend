import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { CitasService } from './citas.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('citas')
@UseGuards(JwtAuthGuard)
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCitaDto: CreateCitaDto) {
    return this.citasService.create(createCitaDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    if (startDate && endDate) {
      return this.citasService.findByDateRange(startDate, endDate);
    }
    return this.citasService.findAll();
  }

  @Get('paciente/:pacienteId')
  @HttpCode(HttpStatus.OK)
  findByPaciente(@Param('pacienteId') pacienteId: string) {
    return this.citasService.findByPaciente(pacienteId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.citasService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateCitaDto: UpdateCitaDto) {
    return this.citasService.update(id, updateCitaDto);
  }

  @Patch(':id/estado')
  @HttpCode(HttpStatus.OK)
  updateEstado(@Param('id') id: string, @Body('estado') estado: string) {
    return this.citasService.updateEstado(id, estado);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.citasService.remove(id);
  }
}
