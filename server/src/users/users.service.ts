import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDTO } from './users.dto';
import { User } from './users.interface';
import { League } from 'src/league/league.interface';
const bcrypt = require('bcrypt');

@Injectable()
export class UsersService {
private readonly users: User[];
    private saltRounds = 10;
    private readonly logger = new Logger(UsersService.name);
    constructor(@InjectModel('User') private readonly userModel: Model<User>) { }

    async findOne(email: string): Promise<User | undefined> {
        return this.users.find(user => user.email === email);
    }

    async addUser(user: User): Promise<User>{
        let hash = await bcrypt.hash(user['password'], this.saltRounds).then(async function(hash){
            return hash;
        });

        let u: User = {
            "email": user['email'],
            "password": hash,
            "leagues": [],
            "fantasyTeams": []
        }
        return await this.saveUser(u)        
    }

    async validateUser(email: string, password: string): Promise<any>{
        let user = await this.getUser(email);
        let result = await bcrypt.compare(password, user['password']);

        if(result){
            return true;
        }       

        return false;
    }

    async checkLeague(league: string, user: User): Promise<any>{
        this.logger.log(`Entered checkLeague() for user ${user.email} with ${league}`)
        for(let x in user.leagues){
            if(user.leagues[x] == league){
                return false;
            }
        }
        return true;
    }

    async saveUser(userDTO: UserDTO): Promise<User>{
        const newUser = await this.userModel(userDTO);
        return newUser.save()
    }

    async updateUser(userId, userUpdate: UserDTO): Promise<User>{
        const user = await this.userModel.findByIdAndUpdate(userId, userUpdate, {useFindAndModify: false});
        return user;
    }

    async getUser(e: string): Promise<User>{
        const user = await this.userModel.findOne({email: e}).exec();
        return user;
    }
}
