
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    rut: string;

    @Column()
    fecha_nacimiento: string;

    @Column()
    ciudad: string;

    @Column('text', { array: true, nullable: true })
    gustos?: string[];
}
