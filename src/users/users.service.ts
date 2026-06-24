import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class UsersService {
    findAll() {
        const file = readFileSync(join(__dirname, '..', 'db', 'users.json'), 'utf-8');
        return JSON.parse(file);
    }

    createUser(user: any) {
        const users = this.findAll();
        const exists = users.some((u: any) => u.rut === user.rut);
        if (exists) {
            throw new ConflictException(`User with RUT ${user.rut} already exists`);
        }
        users.push(user);
        this.saveUsers(users);
        return user;
    }

    deleteUser(rut: string) {
        const users = this.findAll();
        const index = users.findIndex((user: any) => user.rut === rut);
        if (index === -1) {
            throw new NotFoundException(`User with RUT ${rut} not found`);
        }
        const deletedUser = users[index];
        users.splice(index, 1);
        this.saveUsers(users);
        return deletedUser;
    }

    private saveUsers(users: any[]) {
        const data = JSON.stringify(users, null, 4);
        const activePath = join(__dirname, '..', 'db', 'users.json');
        writeFileSync(activePath, data, 'utf-8');

        const sourcePath = join(process.cwd(), 'src', 'db', 'users.json');
        if (existsSync(sourcePath)) {
            writeFileSync(sourcePath, data, 'utf-8');
        }
    }
}
