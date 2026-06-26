import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  findAll() {
    return this.usersRepository.find();
  }

  async createUser(user: CreateUserDto) {
    const exists = await this.usersRepository.findOne({ where: { rut: user.rut } });
    if (exists) {
      throw new ConflictException(`User with RUT ${user.rut} already exists`);
    }
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }


  async deleteUser(rut: string) {
    const user = await this.usersRepository.findOne({ where: { rut } });
    if (!user) {
      throw new NotFoundException(`User with RUT ${rut} not found`);
    }
    await this.usersRepository.remove(user);
    return user;
  }

}
