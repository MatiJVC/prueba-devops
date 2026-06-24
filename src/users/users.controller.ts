import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Post()
    create(@Body() user: CreateUserDto) {
        return this.usersService.createUser(user);
    }

    @Delete(':rut')
    delete(@Param('rut') rut: string) {
        return this.usersService.deleteUser(rut);
    }
}
