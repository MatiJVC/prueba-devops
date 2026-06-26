import { IsNotEmpty, IsString, IsArray, ArrayNotEmpty} from 'class-validator';

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

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  gustos: string[];
}
