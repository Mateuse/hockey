import { Player } from "../players/player.interface";
import { Team } from "../teams/team.interface";

export class FantasyDTO {
    readonly name: string;
    readonly players: Player[];
    readonly teams: Team[];
    readonly poolPoints: number;
    readonly league: string;
}