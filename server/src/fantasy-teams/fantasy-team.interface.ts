import { Player } from '../players/player.interface';
import { Team } from '../teams/team.interface';

export interface FantasyTeam {
    id: Number,
    name: string,
    players: Number[],
    teams: Number[],
    points: Number
}

