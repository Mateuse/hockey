import { Document } from 'mongoose';
import { League } from '../league/league.interface';
import { FantasyTeam } from '../fantasy-teams/fantasy-team.interface';

export interface User extends Document{
    email: string,
    password: string,
    leagues: String[],
    fantasyTeams: FantasyTeam[]
}