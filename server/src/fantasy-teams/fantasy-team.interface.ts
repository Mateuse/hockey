import { Player } from '../players/player.interface';
import { Team } from '../teams/team.interface';

export interface FantasyTeam {
    id: number,
    name: string,
    players: number[],
    teams: number[],
    poolPoints: number
}

