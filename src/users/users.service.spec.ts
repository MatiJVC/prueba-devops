import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUsers = [
    {
      id: 1,
      nombre: 'matias',
      rut: '21546041-k',
      fecha_nacimiento: '06-04-2004',
      ciudad: 'Coquimbo',
      gustos: ['harry potter', 'videojuegos', 'programacion']
    },
    {
      id: 2,
      nombre: 'fernando',
      rut: '12345678-9',
      fecha_nacimiento: '01-01-2000',
      ciudad: 'Santiago',
      gustos: ['Minecraft', 'Juego de tronos', 'Peliculas de accion']
    },
  ];

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      mockRepository.find.mockResolvedValue(mockUsers);

      const result = await service.findAll();
      expect(result).toEqual(mockUsers);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('createUser', () => {
    it('should create and save a new user', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      const newUser = {
        nombre: 'camila',
        rut: '12345677-9',
        fecha_nacimiento: '01-01-2000',
        ciudad: 'Santiago',
        gustos: ['comida italiana', 'libros', 'viajar'],
      };
      mockRepository.create.mockReturnValue(newUser);
      mockRepository.save.mockResolvedValue(newUser);

      const result = await service.createUser(newUser);
      expect(result).toEqual(newUser);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { rut: newUser.rut } });
      expect(mockRepository.create).toHaveBeenCalledWith(newUser);
      expect(mockRepository.save).toHaveBeenCalledWith(newUser);
    });

    it('should throw ConflictException if user already exists', async () => {
      const existingUser = {
        nombre: 'matias',
        rut: '21546041-k',
        fecha_nacimiento: '06-04-2004',
        ciudad: 'Coquimbo',
        gustos: ['harry potter', 'videojuegos', 'programacion'],
      };
      mockRepository.findOne.mockResolvedValue(existingUser);

      await expect(service.createUser(existingUser)).rejects.toThrow(ConflictException);
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should delete a user and return the deleted user', async () => {
      const userToDelete = mockUsers[1];
      mockRepository.findOne.mockResolvedValue(userToDelete);
      mockRepository.remove.mockResolvedValue(userToDelete);

      const result = await service.deleteUser('12345678-9');
      expect(result.rut).toBe('12345678-9');
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { rut: '12345678-9' } });
      expect(mockRepository.remove).toHaveBeenCalledWith(userToDelete);
    });

    it('should throw NotFoundException if user to delete does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteUser('non-existent')).rejects.toThrow(NotFoundException);
      expect(mockRepository.remove).not.toHaveBeenCalled();
    });
  });
});
