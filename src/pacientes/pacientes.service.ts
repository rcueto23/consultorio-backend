import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';

@Injectable()
export class PacientesService {
  constructor(private prisma: PrismaService) {}

  async create(createPacienteDto: CreatePacienteDto) {
    // Verificar si ya existe un paciente con ese documento
    const existingPaciente = await this.prisma.paciente.findUnique({
      where: { documento: createPacienteDto.documento },
    });

    if (existingPaciente) {
      throw new ConflictException('Ya existe un paciente con ese número de documento');
    }

    // Convertir fecha de string a Date si existe
    const data = {
      ...createPacienteDto,
      nacimiento: createPacienteDto.nacimiento
        ? new Date(createPacienteDto.nacimiento)
        : null,
    };

    return this.prisma.paciente.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.paciente.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const paciente = await this.prisma.paciente.findUnique({
      where: { id },
    });

    if (!paciente) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }

    return paciente;
  }

  async update(id: string, updatePacienteDto: UpdatePacienteDto) {
    // Verificar que el paciente existe
    await this.findOne(id);

    // Si se está actualizando el documento, verificar que no exista otro paciente con ese documento
    if (updatePacienteDto.documento) {
      const existingPaciente = await this.prisma.paciente.findUnique({
        where: { documento: updatePacienteDto.documento },
      });

      if (existingPaciente && existingPaciente.id !== id) {
        throw new ConflictException('Ya existe otro paciente con ese número de documento');
      }
    }

    // Convertir fecha de string a Date si existe
    const data = {
      ...updatePacienteDto,
      nacimiento: updatePacienteDto.nacimiento
        ? new Date(updatePacienteDto.nacimiento)
        : undefined,
    };

    return this.prisma.paciente.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    // Verificar que el paciente existe
    await this.findOne(id);

    return this.prisma.paciente.delete({
      where: { id },
    });
  }
}
