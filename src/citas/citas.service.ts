import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';

@Injectable()
export class CitasService {
  constructor(private prisma: PrismaService) {}

  async create(createCitaDto: CreateCitaDto) {
    return this.prisma.cita.create({
      data: {
        ...createCitaDto,
        fecha: new Date(createCitaDto.fecha),
      },
      include: {
        paciente: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            documento: true,
            telefono: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.cita.findMany({
      include: {
        paciente: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            documento: true,
            telefono: true,
            email: true,
          },
        },
      },
      orderBy: {
        fecha: 'desc',
      },
    });
  }

  async findByDateRange(startDate: string, endDate: string) {
    return this.prisma.cita.findMany({
      where: {
        fecha: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      include: {
        paciente: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            documento: true,
            telefono: true,
            email: true,
          },
        },
      },
      orderBy: {
        fecha: 'asc',
      },
    });
  }

  async findByPaciente(pacienteId: string) {
    return this.prisma.cita.findMany({
      where: { pacienteId },
      include: {
        paciente: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            documento: true,
          },
        },
      },
      orderBy: {
        fecha: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const cita = await this.prisma.cita.findUnique({
      where: { id },
      include: {
        paciente: true,
      },
    });

    if (!cita) {
      throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    }

    return cita;
  }

  async update(id: string, updateCitaDto: UpdateCitaDto) {
    await this.findOne(id);

    const updateData: any = { ...updateCitaDto };
    if (updateCitaDto.fecha) {
      updateData.fecha = new Date(updateCitaDto.fecha);
    }

    return this.prisma.cita.update({
      where: { id },
      data: updateData,
      include: {
        paciente: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            documento: true,
            telefono: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.cita.delete({
      where: { id },
    });
  }

  async updateEstado(id: string, estado: string) {
    await this.findOne(id);
    return this.prisma.cita.update({
      where: { id },
      data: { estado },
      include: {
        paciente: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
          },
        },
      },
    });
  }
}
