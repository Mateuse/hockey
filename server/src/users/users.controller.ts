import { Controller, Post, Res, Body, HttpStatus, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.interface';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService){}

    @Post('add')
    async addUser(@Res() res, @Body() id: User){
        const user = await this.usersService.addUser(id);

        return res.status(HttpStatus.OK).json({
            user
        })
    }

}
