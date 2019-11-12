import { Player } from "../players/player.interface";
import { Team } from "../teams/team.interface";

export interface FantasyTeam {
    id: number,
    name: string,
    players: Player[],
    teams: Team[],
    poolPoints: number
}

