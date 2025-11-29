import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    // Total de pacientes
    const totalPacientes = await this.prisma.paciente.count();

    // Pacientes activos
    const pacientesActivos = await this.prisma.paciente.count({
      where: { estado: 'activo' },
    });

    // Citas del mes
    const citasMes = await this.prisma.cita.count({
      where: {
        fecha: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    // Próximas citas de hoy
    const citasHoy = await this.prisma.cita.findMany({
      where: {
        fecha: {
          gte: startOfToday,
          lte: endOfToday,
        },
        estado: {
          in: ['pendiente', 'en_curso'],
        },
      },
      include: {
        paciente: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            telefono: true,
          },
        },
      },
      orderBy: {
        fecha: 'asc',
      },
      take: 10,
    });

    // Estadísticas por estado de citas del mes
    const citasPorEstado = await this.prisma.cita.groupBy({
      by: ['estado'],
      where: {
        fecha: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      _count: true,
    });

    return {
      totalPacientes,
      pacientesActivos,
      citasMes,
      citasHoy: citasHoy.length,
      proximasCitas: citasHoy,
      citasPorEstado: citasPorEstado.map((item) => ({
        estado: item.estado,
        cantidad: item._count,
      })),
    };
  }
}
