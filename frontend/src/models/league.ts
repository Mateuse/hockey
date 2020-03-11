import { FantasyTeam } from './fantasyTeam';

export class League{
    id: number;
    name: string;
    commissioner: string;
    teams: Array<FantasyTeam>;
    createdDate: string;
    positionRules: JSON;
    pointRules: JSON;

    constructor(name: string, commissioner: string, teams: Array<FantasyTeam>, positionRules: JSON, pointRules: JSON);
    constructor(name: string, commissioner: string, teams: Array<FantasyTeam>, positionRules: JSON, pointRules: JSON, id: number);
    constructor(name: string, commissioner: string, teams: Array<FantasyTeam>, positionRules: JSON, pointRules: JSON, id?: number)
    {
        this.id = id;
        this.name = name;
        this.commissioner = commissioner;
        this.teams = teams;
        this.createdDate = this.createdDate;
        this.positionRules = positionRules;
        this.pointRules = pointRules;
    }
}