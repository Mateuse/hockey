import { Player } from '../players/player.interface';

export interface FanstasyTeam {
    id: Number,
    name: string,
    players: Player[]
    points: Number
}

export function getTeamPoints(){
    
}