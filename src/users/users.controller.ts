import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import type { User } from './types/User';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): User[] {
    return this.usersService.findAll();
  }

  @Post()
  create(@Body() user: CreateUserDto): User {
    return this.usersService.createUser(user);
  }

  @Delete(':rut')
  delete(@Param('rut') rut: string): User {
    return this.usersService.deleteUser(rut);
  }
}
