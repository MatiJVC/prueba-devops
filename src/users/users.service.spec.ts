import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';

jest.mock('fs');

describe('UsersService', () => {
  let service: UsersService;

  const mockUsers = [
    {
      nombre: 'matias',
      rut: '21546041-k',
      fecha_nacimiento: '06-04-2004',
      ciudad: 'Coquimbo',
      gustos: ['harry potter', 'videojuegos', 'programacion']
    },
    {
      nombre: 'fernando',
      rut: '12345678-9',
      fecha_nacimiento: '01-01-2000',
      ciudad: 'Santiago',
      gustos: ['Minecraft', 'Juego de tronos', 'Peliculas de accion']
    },
  ];

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', () => {
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockUsers));

      const result = service.findAll();
      expect(result).toEqual(mockUsers);
      expect(fs.readFileSync).toHaveBeenCalled();
    });
  });

  describe('createUser', () => {
    it('should create and save a new user', () => {
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockUsers));
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      const newUser = {
        nombre: 'camila',
        rut: '12345677-9',
        fecha_nacimiento: '01-01-2000',
        ciudad: 'Santiago',
        gustos: ['comida italiana', 'libros', 'viajar'],
      };

      const result = service.createUser(newUser);
      expect(result).toEqual(newUser);
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should throw ConflictException if user already exists', () => {
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockUsers));

      const existingUser = {
        nombre: 'matias',
        rut: '21546041-k',
        fecha_nacimiento: '06-04-2004',
        ciudad: 'Coquimbo',
        gustos: ['harry potter', 'videojuegos', 'programacion'],
      };

      expect(() => service.createUser(existingUser)).toThrow(ConflictException);
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should delete a user and return the deleted user', () => {
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockUsers));
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      const result = service.deleteUser('12345678-9');
      expect(result.rut).toBe('12345678-9');
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user to delete does not exist', () => {
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockUsers));

      expect(() => service.deleteUser('non-existent')).toThrow(
        NotFoundException,
      );
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });
  });
});
