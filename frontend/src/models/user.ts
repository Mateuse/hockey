import { League } from './league';

export class User{
    id: number;
    email: string;
    password: string;
    username: string;
    leagues: Array<String>;

    constructor(email: string, password: string, username: string, leagues: Array<String>);
    constructor(email: string, password: string, username: string, leagues: Array<String>, id: number);
    constructor(email: string, password: string, username: string, leagues: Array<String>, id?: number){
        this.id = id;
        this.email = email;
        this.password = password;
        this.username = username;
        this.leagues = leagues;
    }

} 