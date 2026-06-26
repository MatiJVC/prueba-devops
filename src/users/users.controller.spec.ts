import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsers = [
    {
      nombre: 'matias',
      rut: '21546041-k',
      fecha_nacimiento: '06-04-2004',
      ciudad: 'Coquimbo',
      gustos: ['comida italiana', 'libros', 'viajar'],
    },
  ];

  const mockUsersService = {
    findAll: jest.fn().mockResolvedValue(mockUsers),
    createUser: jest.fn().mockImplementation((user) => Promise.resolve(user)),
    deleteUser: jest
      .fn()
      .mockImplementation((rut) => Promise.resolve({ rut, nombre: 'deleted' })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const result = await controller.findAll();
      expect(result).toEqual(mockUsers);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a user', async () => {
      const newUser = {
        nombre: 'camila',
        rut: '12345677-9',
        fecha_nacimiento: '01-01-2000',
        ciudad: 'Santiago',
        gustos: ['comida italiana', 'libros', 'viajar'],
      };
      const result = await controller.create(newUser);
      expect(result).toEqual(newUser);
      expect(service.createUser).toHaveBeenCalledWith(newUser);
    });
  });

  describe('delete', () => {
    it('should delete a user by rut', async () => {
      const result = await controller.delete('12345678-9');
      expect(result.rut).toBe('12345678-9');
      expect(service.deleteUser).toHaveBeenCalledWith('12345678-9');
    });
  });
});
