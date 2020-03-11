import { Document } from 'mongoose';
import { Player } from '../players/player.interface';
import { Team } from '../teams/team.interface';

export interface League extends Document{
    leagueName: string,
    commissioner: string,
    fantasyTeams: any[],
    players: Player[],
    teams: Team[],
    createdDate: string,
    positionRules: JSON,
    pointRules: JSON
}
