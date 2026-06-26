import { IsNotEmpty, IsString, IsArray, ArrayNotEmpty, isArray, isString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  rut: string;

  @IsString()
  @IsNotEmpty()
  fecha_nacimiento: string;

  @IsString()
  @IsNotEmpty()
  ciudad: string;

  @isArray()
  @ArrayNotEmpty()
  @isString({ each: true })
  gustos: string[];
}
