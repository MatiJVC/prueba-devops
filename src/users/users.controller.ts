import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post()
  create(@Body() user: CreateUserDto): Promise<User> {
    return this.usersService.createUser(user);
  }

  @Delete(':rut')
  delete(@Param('rut') rut: string): Promise<User> {
    return this.usersService.deleteUser(rut);
  }
}
