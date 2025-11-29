import { IsDateString, IsNotEmpty, IsOptional, IsString, IsInt, Min } from 'class-validator';

export class CreateCitaDto {
  @IsNotEmpty()
  @IsString()
  pacienteId: string;

  @IsNotEmpty()
  @IsDateString()
  fecha: string;

  @IsOptional()
  @IsInt()
  @Min(15)
  duracion?: number;

  @IsOptional()
  @IsString()
  motivo?: string;

  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsString()
  notas?: string;
}
