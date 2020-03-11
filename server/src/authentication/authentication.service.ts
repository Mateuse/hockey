import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
    private readonly logger = new Logger(AuthenticationService.name)
    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService){}

    async validateUser(email: string, password: string): Promise<any>{
        const user = await this.usersService.findOne(email);
        if(user && user.password == password){
            const { password, ...result} = user;
            return result;
        }
        return null;
    }

    async login(user: any){
        if(await this.usersService.validateUser(user.email, user.password) == true){
            const payload = { email: user.email, sub: user.userId };
            return {
                user: await this.usersService.getUser(user.email),
                access_token: this.jwtService.sign(payload)
            }
        }
        else{
            return new UnauthorizedException();
        }        
    }
}
