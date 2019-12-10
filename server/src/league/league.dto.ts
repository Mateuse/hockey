import { FantasyTeam } from "../fantasy-teams/fantasy-team.interface";

export class LeagueDTO {
    readonly name: string;
    readonly teams: Number[];
    createdDate: string;
    pointRules: JSON;
    positionRules: JSON;
    users: Number[];
}